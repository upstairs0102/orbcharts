import { getTranslations } from 'next-intl/server'
import { Reveal } from './Reveal'
import { QuickDemo } from './QuickDemo'

export async function QuickDemoSection() {
  const t = await getTranslations('Home.QuickDemo')

  return (
    <section aria-labelledby="quick-demo-heading" className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <Reveal>
          <h2
            id="quick-demo-heading"
            className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('heading')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            {t('description')}
          </p>
        </Reveal>
        <div className="mt-12">
          <QuickDemo />
        </div>
      </div>
    </section>
  )
}
