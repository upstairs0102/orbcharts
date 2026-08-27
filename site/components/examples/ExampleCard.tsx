import { ChevronRight } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils'
import type { ExampleSpec } from '@/lib/examples/types'
import { ExampleChart } from './ExampleChart'

interface Props {
  spec: ExampleSpec
  /** 已翻譯的範例標題 */
  title: string
  /** 連結的 aria-label（如「在遊樂場開啟長條圖」） */
  openLabel: string
  /**
   * default：展示頁卡片（含即時圖表預覽）
   * compact：遊樂場切換選單的緊湊卡片（較小比例的圖表預覽）
   */
  variant?: 'default' | 'compact'
  /** compact 用：是否為當前範例 */
  selected?: boolean
}

/**
 * 範例卡片共用元件 — 展示頁與遊樂場切換選單共用。
 * 無 'use client' 指令：可在 Server 與 Client tree 中使用。
 */
export function ExampleCard({ spec, title, openLabel, variant = 'default', selected }: Props) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/playground?example=${spec.id}`}
        aria-label={openLabel}
        aria-current={selected ? 'true' : undefined}
        className={cn(
          'group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors',
          'hover:border-brand/50',
          'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          selected && 'border-brand bg-brand/5'
        )}
      >
        <div className="aspect-[4/3] w-full border-b bg-background p-1">
          <ExampleChart spec={spec} />
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium',
            selected ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          <span
            aria-hidden="true"
            className={cn('size-1.5 shrink-0 rounded-full', selected ? 'bg-brand' : 'bg-border')}
          />
          <span className="truncate">{title}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/playground?example=${spec.id}`}
      aria-label={openLabel}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border bg-card transition-all',
        'hover:border-brand/50 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'
      )}
    >
      <div className="aspect-[4/3] w-full border-b bg-background p-2">
        <ExampleChart spec={spec} />
      </div>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
        />
      </div>
    </Link>
  )
}
