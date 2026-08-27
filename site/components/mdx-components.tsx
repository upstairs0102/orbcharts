import type { MDXComponents } from 'mdx/types'
import { Link } from '@/lib/i18n/navigation'

// MDX 自訂元件對應：主要處理站內連結的語系前綴與外部連結
export const mdxComponents: MDXComponents = {
  a: ({ href = '', children, ...props }) => {
    const isInternal = href.startsWith('/')
    if (isInternal) {
      // next-intl 的 Link 會自動補上語系前綴
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
    }
    const isAnchor = href.startsWith('#')
    return (
      <a
        href={href}
        {...(isAnchor ? {} : { target: '_blank', rel: 'noreferrer' })}
        {...props}
      >
        {children}
      </a>
    )
  },
}
