import type { ExampleDatum } from '../types'

/**
 * RankedPlot 共用資料 — 觀光地每月旅客人次（單位：千人次）
 * 10 個目的地 × 12 個月（2025-01 – 2025-12）= 120 筆
 *
 * 設計重點：各目的地有不同的「季節性」曲線，因此縮放（CategoryZoom）到
 * 不同的時間範圍時，總量排名會洗牌——
 * - 全年：Metro City（全年穩定）居首
 * - 冬季（12–2 月）：Alpine Peak（滑雪）、Hot Springs（溫泉）竄升
 * - 夏季（6–8 月）：Palm Bay、Coral Isle（海灘）、Festival City（7 月慶典）領先
 * - 春季（3–4 月）：Sakura Town（賞櫻）第一
 * - 秋季（10–11 月）：Maple Valley（賞楓）第一
 *
 * 注意：數值為示意資料（非真實統計），以 compact 形式維護、模組載入時展開。
 */
const months: string[] = []
for (let m = 1; m <= 12; m++) months.push(`2025-${String(m).padStart(2, '0')}`)

const destinationTrends: { name: string; values: number[] }[] = [
  //                                 1月   2月   3月   4月   5月   6月   7月   8月   9月  10月  11月  12月
  // prettier-ignore
  { name: 'Metro City',    values: [88,  85,  90,  92,  90,  86,  84,  85,  88,  92,  90,  95] },
  // prettier-ignore
  { name: 'Palm Bay',      values: [28,  30,  38,  55,  80, 120, 138, 132,  95,  55,  35,  30] },
  // prettier-ignore
  { name: 'Coral Isle',    values: [35,  36,  40,  50,  65,  90, 105, 118, 102,  60,  42,  38] },
  // prettier-ignore
  { name: 'Alpine Peak',   values: [125, 118,  90,  45,  28,  22,  20,  24,  30,  48,  85, 130] },
  // prettier-ignore
  { name: 'Hot Springs',   values: [88,  80,  55,  35,  28,  25,  24,  26,  32,  50,  75,  92] },
  // prettier-ignore
  { name: 'Festival City', values: [32,  30,  35,  38,  42,  55, 150,  70,  40,  36,  34,  38] },
  // prettier-ignore
  { name: 'Sakura Town',   values: [25,  32, 135, 148,  60,  30,  26,  24,  28,  35,  30,  26] },
  // prettier-ignore
  { name: 'Maple Valley',  values: [22,  20,  25,  30,  35,  30,  28,  30,  55, 115, 105,  35] },
  // prettier-ignore
  { name: 'Lakeside',      values: [18,  20,  28,  42,  62,  70,  74,  72,  58,  40,  25,  20] },
  // prettier-ignore
  { name: 'Dune Oasis',    values: [70,  66,  58,  40,  22,  12,  10,  12,  25,  45,  60,  72] },
]

export const rankedData: ExampleDatum[] = destinationTrends.flatMap((dest) =>
  dest.values.map((value, i) => ({
    id: `${dest.name}-${i}`,
    name: dest.name,
    series: dest.name,
    category: months[i],
    value,
  }))
)
