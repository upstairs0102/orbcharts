'use client'

import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/demo' as const, key: 'demo' },
  { href: '/playground' as const, key: 'playground' },
  { href: '/docs' as const, key: 'docs' },
]

export function MainNav() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
      {NAV_ITEMS.map(({ href, key }) => {
        const isActive = pathname.startsWith(`/${locale}${href}`)
        return (
          <Link
            key={key}
            href={href}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive
                ? 'text-brand'
                : 'text-muted-foreground',
            )}
          >
            {t(key as 'demo' | 'playground' | 'docs')}
          </Link>
        )
      })}
    </nav>
  )
}
