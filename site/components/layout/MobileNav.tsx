'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/demo' as const, key: 'demo' },
  { href: '/playground' as const, key: 'playground' },
  { href: '/docs' as const, key: 'docs' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      {/* SheetContent 基底無內距（shadcn 慣例由使用端提供），需自行加 p-6 */}
      <SheetContent side="right" className="w-72 p-6">
        <SheetTitle className="text-left font-bold text-lg mb-6">
          OrbCharts
        </SheetTitle>
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ href, key }) => {
            const isActive = pathname.startsWith(`/${locale}${href}`)
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'text-brand bg-brand/10'
                    : 'text-muted-foreground',
                )}
              >
                {t(key as 'demo' | 'playground' | 'docs')}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
