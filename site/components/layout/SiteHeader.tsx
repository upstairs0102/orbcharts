'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/icons/GitHubIcon'
import { MainNav } from './MainNav'
import { MobileNav } from './MobileNav'
import { LocaleSwitcher } from './LocaleSwitcher'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = /^\/(en|zh)\/?$/.test(pathname)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b',
        'border-border/40 bg-background/80 backdrop-blur-md',
        'supports-[backdrop-filter]:bg-background/60',
      )}
    >
      <div className="container max-w-screen-2xl mx-auto flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mr-8 shrink-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo_light_xl_temp2.png`}
            alt="OrbCharts"
            width={32}
            height={32}
            className="dark:hidden"
            priority
          />
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo_dark_temp2.png`}
            alt="OrbCharts"
            width={32}
            height={32}
            className="hidden dark:block"
            priority
          />
          <span className="font-bold text-lg tracking-tight">OrbCharts</span>
        </Link>

        {/* Desktop nav */}
        <MainNav />

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/BPbase/orbcharts"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon className="size-5" />
            </a>
          </Button>
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
