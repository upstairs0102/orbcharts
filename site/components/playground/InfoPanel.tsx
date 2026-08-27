'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ExternalLink } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { generateExampleCode } from '@/lib/examples/codegen'
import { pluginMeta } from '@/lib/examples/types'
import type { ExampleSpec } from '@/lib/examples/types'

interface Props {
  spec: ExampleSpec
  /** 已翻譯的範例標題 */
  exampleTitle: string
}

/**
 * 說明面板 — 內容全部由 spec + registry 推導（零寫死）：
 * 範例名稱、Plugin、資料格式、文件連結、最小可執行程式碼（standalone codegen）。
 */
export function InfoPanel({ spec, exampleTitle }: Props) {
  const t = useTranslations('Playground.Info')
  const meta = pluginMeta[spec.plugin]

  const standaloneCode = useMemo(
    () => generateExampleCode(spec, { mode: 'standalone' }),
    [spec]
  )

  return (
    <div className="h-full space-y-5 overflow-auto p-4 text-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <dt className="font-medium text-muted-foreground">{t('example')}</dt>
        <dd className="font-semibold">{exampleTitle}</dd>
        <dt className="font-medium text-muted-foreground">{t('plugin')}</dt>
        <dd className="font-mono">{spec.plugin}</dd>
        <dt className="font-medium text-muted-foreground">{t('dataFormat')}</dt>
        <dd className="font-mono">{meta.dataFormat}</dd>
      </dl>

      <div>
        <h3 className="mb-2 font-semibold">{t('docs')}</h3>
        <ul className="space-y-1.5">
          <li>
            <Link
              href={`/docs/plugins/${meta.docsSlug}`}
              className="inline-flex items-center gap-1.5 text-brand hover:underline"
            >
              {t('pluginDocs', { plugin: spec.plugin })}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link
              href={`/docs/data-formats/${meta.dataFormat}`}
              className="inline-flex items-center gap-1.5 text-brand hover:underline"
            >
              {t('dataFormatDocs', { format: meta.dataFormat })}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-1 font-semibold">{t('minimalCode')}</h3>
        <p className="mb-2 text-xs text-muted-foreground">{t('minimalCodeHint')}</p>
        <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-3 font-mono text-xs leading-relaxed">
          <code>{standaloneCode}</code>
        </pre>
      </div>
    </div>
  )
}
