'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ExampleSpec } from '@/lib/examples/types'

interface Props {
  spec: ExampleSpec
  className?: string
}

/**
 * 競態說明：
 * 多張卡片同時建立圖表時，會偶發 orbcharts 內部初始化的訂閱時序競態
 * （圖表建立、Layer 的 <g> 存在，但不繪製圖形）。
 * 策略：首次建立採「平行」（所有卡片同時出現、速度快），
 * 建立後驗證是否有實際圖形，失敗者進入「序列化重建佇列」自癒
 * （重建一次一張、拉開間隔，避免重建時再度互相競態）。
 */
const RETRY_GAP_MS = 150
const VERIFY_DELAY_MS = 600
const MAX_ATTEMPTS = 3

let retryQueue: Promise<unknown> = Promise.resolve()

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function enqueueRetry<T>(create: () => Promise<T | null>): Promise<T | null> {
  const task = retryQueue.then(create)
  // 無論成敗都拉開間隔，且單張失敗不阻斷佇列
  retryQueue = task.then(
    () => delay(RETRY_GAP_MS),
    () => delay(RETRY_GAP_MS)
  )
  return task
}

/** 等待容器有非零寬度（最多 ~30 frames），避免在 layout 未完成時初始化圖表 */
async function waitForWidth(el: HTMLElement): Promise<boolean> {
  for (let i = 0; i < 30; i++) {
    if (el.clientWidth > 0) return true
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
  return el.clientWidth > 0
}

/** 圖表是否已實際繪出圖形元素（自癒機制的判斷依據） */
function hasDrawnGraphics(el: HTMLElement): boolean {
  return !!el.querySelector('svg path, svg rect, svg circle, svg text')
}

/**
 * 範例圖表的縮小版即時預覽（展示頁卡片、遊樂場切換選單共用）。
 * - 進入視口才動態載入 orbcharts 並建立圖表，只載入一次
 * - 建立後驗證是否有實際圖形，空白即銷毀重建（最多重試 2 次）
 * - 純展示：pointer-events-none、aria-hidden
 * - 與遊樂場共用 createExampleChart 工廠，保證呈現一致
 */
export function ExampleChart({ spec, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let unmounted = false
    let created: { chart: { destroy(): void } } | null = null

    const destroyCreated = () => {
      try {
        created?.chart.destroy()
      } catch {
        // 銷毀失敗不阻斷流程
      }
      created = null
      el.innerHTML = ''
    }

    const createWithRetry = async () => {
      const { createExampleChart } = await import('@/lib/examples/create-chart')

      const createOnce = async () => {
        if (unmounted) return null
        const hasWidth = await waitForWidth(el)
        if (unmounted || !hasWidth) return null
        return createExampleChart(el, spec, { preview: true })
      }

      // 首次建立：平行（不排隊），所有卡片同時出現
      created = await createOnce()
      if (unmounted) {
        destroyCreated()
        return
      }

      // 自癒機制：驗證是否有實際圖形，空白者進入序列化佇列重建
      for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
        if (!created) break
        await delay(VERIFY_DELAY_MS)
        if (unmounted) {
          destroyCreated()
          return
        }
        if (hasDrawnGraphics(el)) break
        destroyCreated()
        created = await enqueueRetry(createOnce)
      }
      if (unmounted) destroyCreated()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        // 只觸發一次：載入後即停止觀察，捲動往返不重建
        observer.disconnect()
        createWithRetry().catch(() => {
          // 建立失敗保持空白（卡片標題與連結仍可用），不拋出未處理錯誤
        })
      },
      { rootMargin: '100px 0px', threshold: 0 }
    )
    observer.observe(el)

    return () => {
      unmounted = true
      observer.disconnect()
      destroyCreated()
    }
  }, [spec])

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none h-full w-full overflow-hidden', className)}
    >
      {/*
       * 以 CSS transform 將整張圖表縮小 50%（含字級、線寬、間距一併縮小），
       * 而非僅縮小容器尺寸——卡片上能看到比例完整的圖表。
       * relative：OrbCharts 的 SVG 是 position:absolute，容器必須是 positioned
       * ancestor，否則在捲動容器（如選擇範例 Dialog）內 SVG 不會跟著捲動。
       */}
      <div ref={containerRef} className="relative h-[200%] w-[200%] origin-top-left scale-50" />
    </div>
  )
}
