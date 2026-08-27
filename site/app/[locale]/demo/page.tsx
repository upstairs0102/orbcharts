import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { groupExamplesByPlugin } from '@/lib/examples/registry'
import { pluginMeta } from '@/lib/examples/types'
import { ExampleCard } from '@/components/examples/ExampleCard'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Demo' })
  return { title: t('title'), description: t('description') }
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Demo')

  const groups = groupExamplesByPlugin()

  return (
    // 寬度與 SiteHeader 的 container 一致（max-w-screen-2xl + px-4 md:px-6）
    <div className="container max-w-screen-2xl mx-auto px-4 md:px-6 py-16">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('description')}</p>
      </div>

      <div className="mt-12 space-y-16">
        {groups.map(({ plugin, examples }) => (
          <section key={plugin} aria-labelledby={`plugin-${plugin}`}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id={`plugin-${plugin}`} className="text-2xl font-bold tracking-tight">
                {plugin}
              </h2>
              <span className="rounded-full border bg-muted/50 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                {pluginMeta[plugin].dataFormat}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t(`Plugins.${plugin}`)}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {examples.map((spec) => {
                const title = t(`Examples.${spec.titleKey}`)
                return (
                  <ExampleCard
                    key={spec.id}
                    spec={spec}
                    title={title}
                    openLabel={t('openInPlayground', { title })}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
