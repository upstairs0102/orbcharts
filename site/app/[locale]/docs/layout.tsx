import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/lib/i18n/routing'
import { buildNav } from '@/lib/docs'
import { DocsSidebar } from '@/components/docs/DocsSidebar'

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const sections = buildNav(locale as Locale)

  return (
    <div className="container max-w-screen-2xl mx-auto md:flex md:gap-8 md:px-6">
      <DocsSidebar sections={sections} />
      <div className="min-w-0 flex-1 px-4 py-8 md:px-0 md:py-10">{children}</div>
    </div>
  )
}
