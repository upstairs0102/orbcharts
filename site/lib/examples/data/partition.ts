import type { ExampleDatum } from '../types'

/**
 * PartitionPlot 共用資料 — 網站流量來源（單位：千次造訪）
 * → Pie / Rose / Bubble
 */
export const partitionData: ExampleDatum[] = [
  { series: 'Organic Search', value: 480 },
  { series: 'Direct', value: 320 },
  { series: 'Paid Ads', value: 260 },
  { series: 'Social', value: 210 },
  { series: 'Referral', value: 150 },
  { series: 'Email', value: 90 },
]
