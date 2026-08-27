import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Locale } from './i18n/routing'

// docs 內容獨立放在 repo 頂層的 docs/ 資料夾（供其他開發者／AI agent 直接讀取，不需跑網站）
const CONTENT_ROOT = path.join(/*turbopackIgnore: true*/ process.cwd(), '..', 'docs')

export interface DocFrontmatter {
  title: string
  description?: string
  nav?: { group?: string; order?: number }
  charts?: string[]
  related?: string[]
}

export interface DocMeta {
  slug: string[]
  frontmatter: DocFrontmatter
}

export interface DocContent {
  frontmatter: DocFrontmatter
  content: string
}

export interface NavItem {
  title: string
  href: string
  slug: string[]
}

export interface NavSection {
  group: string
  items: NavItem[]
}

// 文件區段（資料夾）的固定排序；空字串代表 docs 首頁
const SECTION_ORDER = [
  'getting-started',
  'data-formats',
  'plugins',
  'api',
  'guides',
  'advanced',
]

function docsDir(locale: string) {
  return path.join(CONTENT_ROOT, locale)
}

/** 遞迴收集某語系底下所有 .mdx 的 slug（相對於 docs/，副檔名去除） */
export function getDocSlugs(locale: Locale): string[][] {
  const root = docsDir(locale)
  if (!fs.existsSync(root)) return []

  const slugs: string[][] = []
  const walk = (dir: string, prefix: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full, [...prefix, entry.name])
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const base = entry.name.replace(/\.mdx$/, '')
        // index.mdx 對應到 docs 首頁（slug 為空陣列）
        slugs.push(base === 'index' ? [...prefix] : [...prefix, base])
      }
    }
  }
  walk(root, [])
  return slugs
}

function resolveFilePath(locale: string, slug: string[]): string | null {
  const root = docsDir(locale)
  const candidates =
    slug.length === 0
      ? [path.join(root, 'index.mdx')]
      : [
          path.join(root, ...slug) + '.mdx',
          path.join(root, ...slug, 'index.mdx'),
        ]
  return candidates.find((p) => fs.existsSync(p)) ?? null
}

/** 讀取單篇文件（frontmatter + 內容）；找不到回傳 null */
export function getDoc(locale: Locale, slug: string[]): DocContent | null {
  const file = resolveFilePath(locale, slug)
  if (!file) return null
  const raw = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data as DocFrontmatter, content }
}

/** 取得某語系所有文件的 meta（含 frontmatter），供導覽列使用 */
export function getAllDocsMeta(locale: Locale): DocMeta[] {
  return getDocSlugs(locale).map((slug) => {
    const doc = getDoc(locale, slug)
    return { slug, frontmatter: doc?.frontmatter ?? { title: slug.join('/') } }
  })
}

/** 依固定區段順序、frontmatter.nav.order 建立側邊欄導覽資料 */
export function buildNav(locale: Locale): NavSection[] {
  const metas = getAllDocsMeta(locale).filter((m) => m.slug.length > 0)

  const sections: NavSection[] = []
  for (const section of SECTION_ORDER) {
    const items = metas
      .filter((m) => m.slug[0] === section)
      .sort(
        (a, b) =>
          (a.frontmatter.nav?.order ?? 999) - (b.frontmatter.nav?.order ?? 999),
      )
      .map<NavItem>((m) => ({
        title: m.frontmatter.title,
        href: `/docs/${m.slug.join('/')}`,
        slug: m.slug,
      }))

    if (items.length === 0) continue

    // 區段標題取該區段第一篇的 nav.group；沒有則用資料夾名
    const groupLabel =
      metas.find((m) => m.slug[0] === section)?.frontmatter.nav?.group ?? section

    sections.push({ group: groupLabel, items })
  }
  return sections
}
