import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Inter, Noto_Sans_TC, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/lib/i18n/routing'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  preload: false,
  variable: '--font-noto-sans-tc',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'

  return {
    title: {
      default: 'OrbCharts',
      template: '%s | OrbCharts',
    },
    description: isZh
      ? '資料驅動的 JavaScript 圖表函式庫 — 六大資料格式、模組化 Plugins，以 D3.js 及 RxJS 為基礎。'
      : 'Data-driven JavaScript chart library — six data formats, modular plugins, built on D3.js and RxJS.',
    keywords: ['d3', 'rxjs', 'svg', 'chart', 'visualization', 'javascript', 'orbcharts'],
    metadataBase: new URL('https://bpbase.github.io/orbcharts'),
    openGraph: {
      type: 'website',
      siteName: 'OrbCharts',
      url: 'https://bpbase.github.io/orbcharts',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  const htmlLang = locale === 'zh' ? 'zh-Hant-TW' : 'en'

  return (
    <html
      lang={htmlLang}
      className={`${inter.variable} ${notoSansTC.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
