'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ExampleCard } from '@/components/examples/ExampleCard'
import { groupExamplesByPlugin } from '@/lib/examples/registry'
import { pluginMeta } from '@/lib/examples/types'

interface Props {
  currentId: string
  /** 已翻譯的當前範例標題（按鈕顯示用） */
  currentTitle: string
}

/**
 * 範例切換選單 — Header 按鈕開啟 Dialog，
 * 內容為依 Plugin 分組的緊湊卡片（與展示頁共用 ExampleCard）。
 */
export function ExampleSwitcher({ currentId, currentTitle }: Props) {
  const t = useTranslations('Playground')
  const tDemo = useTranslations('Demo')
  const [open, setOpen] = useState(false)
  const groups = groupExamplesByPlugin()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex min-w-0 items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm font-semibold hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        aria-label={t('selectExample')}
      >
        <span className="truncate">{currentTitle}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent className="flex max-h-[85dvh] w-[calc(100%-2rem)] max-w-6xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>{t('selectExampleTitle')}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
          {groups.map(({ plugin, examples }) => (
            <section key={plugin} aria-label={plugin}>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-sm font-bold">{plugin}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {pluginMeta[plugin].dataFormat}
                </span>
              </div>
              {/* 點擊卡片（Link 導航）後關閉 Dialog */}
              <div
                className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3"
                onClick={() => setOpen(false)}
              >
                {examples.map((spec) => {
                  const title = tDemo(`Examples.${spec.titleKey}`)
                  return (
                    <ExampleCard
                      key={spec.id}
                      spec={spec}
                      title={title}
                      openLabel={tDemo('openInPlayground', { title })}
                      variant="compact"
                      selected={spec.id === currentId}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
