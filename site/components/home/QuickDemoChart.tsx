'use client'

import { useEffect, useRef } from 'react'
import { OrbCharts } from '@orbcharts/core'
import { PartitionPlot } from '@orbcharts/plugin-basic'
import { demoViews, homeDemoData, type DemoViewKey } from '@/lib/home-demo-data'

interface Props {
  view: DemoViewKey
}

/**
 * 快速展示圖表本體：建立一次 OrbCharts 實例，
 * 之後僅以 showOnly() 切換 Layer——具象化「換圖不動資料」。
 * 本元件以 next/dynamic（ssr: false）載入，僅在 client 執行。
 */
export default function QuickDemoChart({ view }: Props) {
  const domRef = useRef<HTMLDivElement | null>(null)
  const plotRef = useRef<InstanceType<typeof PartitionPlot> | null>(null)

  // 建立圖表（一次）
  useEffect(() => {
    if (!domRef.current) return
    const plot = new PartitionPlot()
    const chart = new OrbCharts(domRef.current, {
      data: homeDemoData,
      theme: {
        // 網站目前僅有 light 配色，鎖定避免與使用者 OS 偏好衝突
        colorScheme: 'light',
      },
      plugins: [plot],
    })
    plotRef.current = plot
    return () => {
      plotRef.current = null
      chart.destroy()
    }
  }, [])

  // 切換視覺呈現（含掛載後的初始視圖）
  useEffect(() => {
    const layers = demoViews.find((v) => v.key === view)?.layers
    if (layers) plotRef.current?.showOnly([...layers])
  }, [view])

  // relative：OrbCharts 的 SVG 為 position:absolute，容器必須是 positioned ancestor
  return <div ref={domRef} className="relative h-full w-full" />
}
