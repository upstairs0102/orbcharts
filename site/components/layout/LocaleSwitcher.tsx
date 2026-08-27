'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { useRouter, usePathname } from '@/lib/i18n/navigation'
import { routing } from '@/lib/i18n/routing'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (nextLocale: (typeof routing.locales)[number]) => {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          aria-label={t('label')}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium uppercase tracking-wide">
            {locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={locale === loc ? 'font-medium' : ''}
          >
            {t(loc as 'en' | 'zh')}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
