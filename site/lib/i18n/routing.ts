import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh'] as const,
  defaultLocale: 'en',
  // GitHub Pages 是純靜態託管，無法跑 middleware 做語系轉址，
  // 所以語系一律顯示在網址上，改由 app/page.tsx 的 redirect('/en') 處理根路徑
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
