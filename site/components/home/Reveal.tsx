'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll reveal 包裝元件：進入視口時淡入上移。
 * 動畫樣式定義於 globals.css 的 [data-reveal]，
 * 並包在 prefers-reduced-motion: no-preference 內 — 關閉動態效果時內容直接顯示。
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={visible ? 'visible' : ''}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
