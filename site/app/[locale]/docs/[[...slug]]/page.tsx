import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/lib/i18n/routing'
import { getDoc, getDocSlugs, type DocFrontmatter } from '@/lib/docs'
import { mdxComponents } from '@/components/mdx-components'

interface Props {
  params: Promise<{ locale: string; slug?: string[] }>
}

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = []
  for (const locale of routing.locales) {
    for (const slug of getDocSlugs(locale)) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params
  const doc = getDoc(locale as Locale, slug)
  if (!doc) return {}
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  }
}

export default async function DocPage({ params }: Props) {
  const { locale, slug = [] } = await params
  if (!routing.locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const doc = getDoc(locale as Locale, slug)
  if (!doc) notFound()

  const { content } = await compileMDX<DocFrontmatter>({
    source: doc.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            { theme: 'github-dark', keepBackground: true },
          ],
        ],
      },
    },
  })

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-3xl prose-headings:scroll-mt-20 prose-table:text-sm">
      {content}
    </article>
  )
}
