'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import type { NavSection } from '@/lib/docs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function NavList({
  sections,
  pathname,
  locale,
  homeLabel,
  onNavigate,
}: {
  sections: NavSection[]
  pathname: string
  locale: string
  homeLabel: string
  onNavigate?: () => void
}) {
  const isHomeActive = pathname === `/${locale}/docs`
  return (
    <nav className="flex flex-col gap-6" aria-label="文件導覽">
      {/* 文件首頁連結 */}
      <Link
        href="/docs"
        onClick={onNavigate}
        className={cn(
          'block rounded-md px-2 py-1.5 text-sm transition-colors',
          isHomeActive
            ? 'bg-brand/10 font-medium text-brand'
            : 'font-medium text-foreground hover:bg-accent/50',
        )}
      >
        {homeLabel}
      </Link>

      {sections.map((section) => (
        <div key={section.group}>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            {section.group}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = pathname === `/${locale}${item.href}`
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'block rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-brand/10 font-medium text-brand'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function DocsSidebar({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const homeLabel = locale === 'zh' ? '總覽' : 'Overview'

  return (
    <>
      {/* 行動版：頂部的開關列 */}
      <div className="md:hidden flex items-center gap-2 border-b border-border/40 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-label="開啟文件選單"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="ml-1.5">文件選單</span>
        </Button>
      </div>

      {open && (
        <div className="md:hidden border-b border-border/40 px-4 py-4">
          <NavList
            sections={sections}
            pathname={pathname}
            locale={locale}
            homeLabel={homeLabel}
            onNavigate={() => setOpen(false)}
          />
        </div>
      )}

      {/* 桌面版：固定側邊欄 */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-border/40">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-8">
          <NavList
            sections={sections}
            pathname={pathname}
            locale={locale}
            homeLabel={homeLabel}
          />
        </div>
      </aside>
    </>
  )
}
