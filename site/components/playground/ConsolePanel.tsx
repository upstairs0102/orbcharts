'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ConsoleEntry } from '@/lib/playground/sandbox'

interface Props {
  entries: ConsoleEntry[]
  onClear: () => void
}

const levelStyles: Record<ConsoleEntry['level'], string> = {
  log: 'text-foreground',
  info: 'text-brand',
  warn: 'text-amber-600',
  error: 'text-destructive',
}

/**
 * Console 面板：
 * - 預設只顯示最新一筆輸出（完整內容、不截斷）
 * - 可展開「歷史紀錄」查看本次執行的其餘輸出（最新在上）
 *   （同步的自訂 console.log 會被稍後非同步到達的資料流 log 蓋掉最新位置，
 *    歷史紀錄確保它們仍然可見）
 */
export function ConsolePanel({ entries, onClear }: Props) {
  const t = useTranslations('Playground.Console')
  const latest = entries.at(-1)
  // 歷史（不含最新一筆），最新在上
  const history = entries.slice(0, -1).reverse()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b px-3 py-1.5">
        <p className="min-w-0 truncate text-xs text-muted-foreground">{t('latestOnly')}</p>
        <Button
          variant="ghost"
          size="xs"
          className="ml-auto shrink-0"
          onClick={onClear}
          disabled={!latest}
        >
          {t('clear')}
        </Button>
      </div>
      <div
        className="min-h-0 flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed"
        aria-live="polite"
      >
        {!latest ? (
          <p className="text-muted-foreground">{t('empty')}</p>
        ) : (
          <>
            <div className={cn('whitespace-pre-wrap', levelStyles[latest.level])}>
              {latest.text}
            </div>
            {history.length > 0 && (
              <details className="mt-3 border-t pt-2">
                <summary className="cursor-pointer select-none text-muted-foreground hover:text-foreground">
                  {t('history', { count: history.length })}
                </summary>
                <div className="mt-1">
                  {history.map((entry, i) => (
                    <div
                      key={i}
                      className={cn(
                        'whitespace-pre-wrap border-b border-border/40 py-1.5 last:border-0',
                        levelStyles[entry.level]
                      )}
                    >
                      {entry.text}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  )
}
