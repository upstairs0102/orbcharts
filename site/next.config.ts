import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts')

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const BASE_PATH = '/orbcharts'

const nextConfig: NextConfig = {
  output: 'export',
  // 部署於 GitHub Pages（project page）：<user-or-org>.github.io/orbcharts，
  // 所有路由與 /_next 資源都需要 /orbcharts 前綴
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  images: {
    // static export 沒有 Image Optimization API 可用
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  turbopack: {
    // pnpm workspace：packages/@orbcharts/* 透過 symlink 連進來，root 要指到 monorepo 根目錄
    root: path.join(__dirname, '..'),
  },
}

export default withNextIntl(withMDX(nextConfig))
