import type { ExampleDatum } from '../types'

/**
 * GridPlot 共用資料 — 電商通路季度營收（二維：2 datasets）
 * dataset 0：四個通路的季度營收（單位：千美元）→ Bar / Line / Area / Stacked / Triangle
 * dataset 1：季度訂單數（單位：百筆）→ 長條+折線組合的折線
 *
 * 注意：series 名稱刻意不含空格——orbcharts 4.0.0-alpha.0 的 LineArea / TriangleBar
 * 會把 series label 直接嵌入 SVG gradient id，含空格的 label 會產生不合法的 id
 * 導致漸層失效（fill 變黑）。待上游修復後可改回自然命名。
 */
export const gridData: ExampleDatum[][] = [
  // dataset 0：通路營收
  [
    { series: 'Online', category: '2024Q1', value: 1250 },
    { series: 'Online', category: '2024Q2', value: 1380 },
    { series: 'Online', category: '2024Q3', value: 1520 },
    { series: 'Online', category: '2024Q4', value: 1610 },
    { series: 'Online', category: '2025Q1', value: 1490 },
    { series: 'Online', category: '2025Q2', value: 1730 },
    { series: 'Marketplace', category: '2024Q1', value: 980 },
    { series: 'Marketplace', category: '2024Q2', value: 1050 },
    { series: 'Marketplace', category: '2024Q3', value: 1190 },
    { series: 'Marketplace', category: '2024Q4', value: 1260 },
    { series: 'Marketplace', category: '2025Q1', value: 1310 },
    { series: 'Marketplace', category: '2025Q2', value: 1420 },
    { series: 'Retail', category: '2024Q1', value: 860 },
    { series: 'Retail', category: '2024Q2', value: 820 },
    { series: 'Retail', category: '2024Q3', value: 790 },
    { series: 'Retail', category: '2024Q4', value: 850 },
    { series: 'Retail', category: '2025Q1', value: 780 },
    { series: 'Retail', category: '2025Q2', value: 760 },
    { series: 'Wholesale', category: '2024Q1', value: 540 },
    { series: 'Wholesale', category: '2024Q2', value: 610 },
    { series: 'Wholesale', category: '2024Q3', value: 580 },
    { series: 'Wholesale', category: '2024Q4', value: 660 },
    { series: 'Wholesale', category: '2025Q1', value: 700 },
    { series: 'Wholesale', category: '2025Q2', value: 690 },
  ],
  // dataset 1：訂單數（長條+折線組合的折線用）
  [
    { series: 'Orders', category: '2024Q1', value: 410 },
    { series: 'Orders', category: '2024Q2', value: 450 },
    { series: 'Orders', category: '2024Q3', value: 495 },
    { series: 'Orders', category: '2024Q4', value: 520 },
    { series: 'Orders', category: '2025Q1', value: 510 },
    { series: 'Orders', category: '2025Q2', value: 565 },
  ],
]
