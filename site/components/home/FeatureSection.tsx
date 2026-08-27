import { getTranslations } from 'next-intl/server'
import { Database, Repeat, LayoutDashboard } from 'lucide-react'
import { Reveal } from './Reveal'

export async function FeatureSection() {
  const t = await getTranslations('Home.Features')

  const features = [
    { Icon: Database, title: t('f1Title'), body: t('f1Body') },
    { Icon: Repeat, title: t('f2Title'), body: t('f2Body') },
    { Icon: LayoutDashboard, title: t('f3Title'), body: t('f3Body') },
  ]

  return (
    <section aria-labelledby="features-heading" className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
      <Reveal>
        <h2
          id="features-heading"
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {t('heading')}
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 100} className="h-full">
            <article className="flex h-full flex-col rounded-xl border bg-card p-6 sm:p-8">
              <div className="mb-5 inline-flex size-11 items-center justify-center self-start rounded-lg bg-brand/10 text-brand">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
