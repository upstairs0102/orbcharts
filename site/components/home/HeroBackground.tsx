'use client'

/**
 * Hero 區塊的裝飾背景：細格線 + 緩慢旋轉的軌道環（呼應 "Orb"）。
 * 純 CSS 動畫（除了黃色泡泡）、aria-hidden，不影響可讀性。
 *
 * 黃色泡泡以 JS requestAnimationFrame 驅動：
 *   - 起始位置在橢圓軌道最左端
 *   - 首次被拖曳後才會啟動「跟隨滑鼠」行為
 *   - 可用滑鼠拖曳，放開後停留 2 秒再緩慢回歸橢圓軌道
 *   - 滑鼠在畫布上移動時，緩慢飄向游標右下方（首次拖曳後才啟用）
 */

import { useEffect, useRef } from 'react'

const PERIOD_MS = 110_000
const A = 520, B = 340, PHI = Math.PI / 4

function orbitPos(ms: number) {
  const t = (2 * Math.PI * (ms % PERIOD_MS)) / PERIOD_MS
  return {
    x: 600 + A * Math.cos(t) * Math.cos(PHI) - B * Math.sin(t) * Math.sin(PHI),
    y: 600 + A * Math.cos(t) * Math.sin(PHI) + B * Math.sin(t) * Math.cos(PHI),
  }
}

// 橢圓最左端往下一點：θ = π - arctan(B/A) 是最左端，往前退 0.2 rad 使 y 增加（位置偏下）
const START_OFFSET_MS = Math.round(((Math.PI - Math.atan(B / A) - 0.4) / (2 * Math.PI)) * PERIOD_MS)
const START_POS = orbitPos(START_OFFSET_MS) // ≈ (161, 424)

export function HeroBackground() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<SVGCircleElement>(null)
  const stateRef = useRef({
    startTime: 0,
    pos: { ...START_POS },
    lastMove: 0,
    mouseTarget: null as { x: number; y: number } | null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    hasBeenDragged: false, // hover-follow 只在首次拖曳後啟用
    raf: 0,
  })

  useEffect(() => {
    const s = stateRef.current
    // 讓軌道從最左端開始
    s.startTime = performance.now() - START_OFFSET_MS
    s.pos = { ...START_POS }

    function tick(now: number) {
      if (!s.isDragging) {
        const orbit = orbitPos(now - s.startTime)
        const active = s.hasBeenDragged && s.mouseTarget !== null && now - s.lastMove < 2000
        const tx = active ? s.mouseTarget!.x : orbit.x
        const ty = active ? s.mouseTarget!.y : orbit.y
        s.pos.x += (tx - s.pos.x) * 0.007
        s.pos.y += (ty - s.pos.y) * 0.007
      }

      bubbleRef.current?.setAttribute('cx', s.pos.x.toFixed(1))
      bubbleRef.current?.setAttribute('cy', s.pos.y.toFixed(1))

      s.raf = requestAnimationFrame(tick)
    }

    s.raf = requestAnimationFrame(tick)

    function toSvgPoint(clientX: number, clientY: number) {
      const svg = svgRef.current
      if (!svg) return null
      const ctm = svg.getScreenCTM()
      if (!ctm) return null
      const pt = svg.createSVGPoint()
      pt.x = clientX
      pt.y = clientY
      return pt.matrixTransform(ctm.inverse())
    }

    function onMouseDown(e: MouseEvent) {
      const svgPt = toSvgPoint(e.clientX, e.clientY)
      if (!svgPt) return
      const dx = svgPt.x - s.pos.x
      const dy = svgPt.y - s.pos.y
      if (Math.sqrt(dx * dx + dy * dy) > 20) return

      s.isDragging = true
      s.hasBeenDragged = true  // 解鎖 hover-follow
      s.dragOffset = { x: dx, y: dy }
      document.body.style.cursor = 'grabbing'
      e.preventDefault()
    }

    function onMouseUp() {
      if (!s.isDragging) return
      s.isDragging = false
      document.body.style.cursor = ''
      // 停在放開的位置，2 秒後回軌道
      s.mouseTarget = { x: s.pos.x, y: s.pos.y }
      s.lastMove = performance.now()
    }

    function onMouseMove(e: MouseEvent) {
      const svg = svgRef.current
      const container = containerRef.current
      if (!svg || !container) return

      const svgPt = toSvgPoint(e.clientX, e.clientY)
      if (!svgPt) return

      if (s.isDragging) {
        s.pos.x = svgPt.x - s.dragOffset.x
        s.pos.y = svgPt.y - s.dragOffset.y
        return
      }

      // grab cursor 提示（首次拖曳前也顯示，方便使用者發現可拖）
      const ddx = svgPt.x - s.pos.x
      const ddy = svgPt.y - s.pos.y
      const near = Math.sqrt(ddx * ddx + ddy * ddy) < 20
      if (near) {
        document.body.style.cursor = 'grab'
      } else if (document.body.style.cursor === 'grab') {
        document.body.style.cursor = ''
      }

      // hover-follow：首次拖曳後才啟用
      if (!s.hasBeenDragged) return

      const cr = container.getBoundingClientRect()
      const inBounds =
        e.clientX >= cr.left && e.clientX <= cr.right &&
        e.clientY >= cr.top && e.clientY <= cr.bottom
      if (!inBounds) return

      const sr = svg.getBoundingClientRect()
      const visXMin = Math.max(0, cr.left - sr.left) + 20
      const visXMax = Math.min(1200, cr.right - sr.left) - 20

      s.mouseTarget = {
        x: Math.min(Math.max(svgPt.x + 30, visXMin), visXMax),
        y: svgPt.y + 30,
      }
      s.lastMove = performance.now()
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      cancelAnimationFrame(s.raf)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="home-grid-bg absolute inset-0" />
      <svg
        ref={svgRef}
        className="absolute left-1/2 top-1/2 h-[1200px] w-[1200px] max-w-none -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1200 1200"
        fill="none"
      >
        {/* 最內圈：靜態實線，較淡 */}
        <circle cx="600" cy="600" r="280" stroke="var(--foreground)" strokeWidth="1" strokeOpacity="0.1" />

        {/* 中圈：虛線 2/10，藍色泡泡 + 小灰色月亮泡泡 */}
        <g className="animate-orbit-slow" style={{ transformOrigin: '600px 600px' }}>
          <circle
            cx="600" cy="600" r="420"
            stroke="var(--foreground)" strokeWidth="1"
            strokeDasharray="2 10" strokeOpacity="0.45"
          />
          <circle cx="1020" cy="600" r="11" fill="var(--brand)" opacity="0.7" />
          <circle
            cx="1020" cy="600"
            r="5"
            fill="#9ca3af"
            opacity="0.9"
            style={{ animation: 'home-orbit-moon 8s linear infinite reverse' }}
          />
        </g>

        {/* 中外圈 */}
        <g style={{ transformOrigin: '600px 600px', animation: 'home-orbit 120s linear infinite reverse' }}>
          <circle
            cx="600" cy="600" r="490"
            stroke="var(--foreground)" strokeWidth="1"
            strokeDasharray="6 14" strokeOpacity="0.3"
          />
          <circle cx="600" cy="1090" r="9" fill="var(--brand)" opacity="0.4" />
        </g>

        {/* 黃色泡泡：JS 控制位置，可拖曳，初始在軌道最左端 */}
        <circle
          ref={bubbleRef}
          cx={START_POS.x.toFixed(1)}
          cy={START_POS.y.toFixed(1)}
          r="9"
          fill="#fbbf24"
          opacity="0.8"
        />

        {/* 外圈 */}
        <g className="animate-orbit-slower" style={{ transformOrigin: '600px 600px' }}>
          <circle cx="600" cy="600" r="560" stroke="var(--foreground)" strokeWidth="1" strokeOpacity="0.1" />
          <circle cx="600" cy="40" r="8.5" fill="var(--muted-foreground)" opacity="0.5" />
        </g>
      </svg>
    </div>
  )
}
