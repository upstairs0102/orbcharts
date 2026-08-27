import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PlaygroundShell } from '@/components/playground/PlaygroundShell'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Playground' })
  return { title: t('title'), description: t('description') }
}

export default async function PlaygroundPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Playground')

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      {/* PlaygroundShell 使用 useSearchParams（?example=<id>），需 Suspense 邊界以維持 SSG */}
      <Suspense fallback={null}>
        <PlaygroundShell />
      </Suspense>
    </>
  )
}
