/**
 * 首頁「快速展示」共用資料 —
 * 同一份物件同時餵給資料面板（顯示）與 OrbCharts 圖表（渲染），
 * 程式碼層面也真正做到單一資料來源。
 */
export const homeDemoData: { series: string; value: number }[] = [
  { series: 'Mobile', value: 45 },
  { series: 'Desktop', value: 28 },
  { series: 'Tablet', value: 17 },
  { series: 'TV', value: 10 },
  { series: 'Wearable', value: 6 },
]

/** 輪播的視覺呈現：對應 PartitionPlot 的 Layer 組合 */
export const demoViews = [
  { key: 'pie', layers: ['Pie', 'PieLabel'] },
  { key: 'rose', layers: ['Rose', 'RoseLabel'] },
  { key: 'bubble', layers: ['Bubble'] },
] as const

export type DemoView = (typeof demoViews)[number]
export type DemoViewKey = DemoView['key']
