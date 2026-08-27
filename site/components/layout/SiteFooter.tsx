import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Separator } from '@/components/ui/separator'

const NAV_ITEMS = [
  { href: '/' as const, key: 'home' },
  { href: '/demo' as const, key: 'demo' },
  { href: '/playground' as const, key: 'playground' },
  { href: '/docs' as const, key: 'docs' },
] as const

export async function SiteFooter() {
  const tNav = await getTranslations('Nav')
  const tFooter = await getTranslations('Footer')

  return (
    <footer className="border-t border-border/40">
      <div className="container max-w-screen-2xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-bold text-base tracking-tight">OrbCharts</span>
            <span className="text-xs text-muted-foreground">{tFooter('tagline')}</span>
          </div>

          {/* Nav */}
          <nav
            className="flex items-center gap-1 flex-wrap justify-center"
            aria-label="Footer navigation"
          >
            {NAV_ITEMS.map(({ href, key }, i) => (
              <span key={key} className="flex items-center">
                {i > 0 && (
                  <Separator orientation="vertical" className="h-3 mx-2 bg-border/60" />
                )}
                <Link
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav(key)}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <div className="mt-8 space-y-1 text-center md:text-left">
          <p className="text-xs text-muted-foreground/70">{tFooter('copyright')}</p>
          {/* 版權行講「誰擁有」、授權行講「你可以怎麼用」——消除「是否開源」的誤讀 */}
          <p className="text-xs text-muted-foreground/70">
            {tFooter('licensePrefix')}
            <a
              href="https://github.com/BPbase/orbcharts/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Apache License 2.0
            </a>
            {tFooter('licenseSuffix')}
          </p>
        </div>
      </div>
    </footer>
  )
}
