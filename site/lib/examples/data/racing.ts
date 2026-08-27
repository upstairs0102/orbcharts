import type { ExampleDatum } from '../types'

/**
 * RacingPlot 共用資料 — 程式語言流行度變化（popularity index）
 * 時間幀以 category 欄位表達（demo 驗證過的 v4 用法）：
 * 每筆 = 一個語言 × 一個季度；8 語言 × 24 季（2019 Q1 – 2024 Q4）= 192 筆
 *
 * 注意：trend 數值為示意資料（非真實統計），以 compact 形式維護、模組載入時展開。
 */
const frames: string[] = []
for (let year = 2019; year <= 2024; year++) {
  for (let q = 1; q <= 4; q++) frames.push(`${year} Q${q}`)
}

const languageTrends: { name: string; values: number[] }[] = [
  // prettier-ignore
  { name: 'Python',     values: [30, 31, 32, 33, 34, 35, 36, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50, 51, 52, 52, 53] },
  // prettier-ignore
  { name: 'JavaScript', values: [34, 34, 33, 33, 33, 32, 32, 32, 31, 31, 31, 30, 30, 30, 29, 29, 29, 28, 28, 28, 28, 27, 27, 27] },
  // prettier-ignore
  { name: 'Java',       values: [26, 26, 25, 25, 24, 24, 23, 22, 22, 21, 20, 20, 19, 19, 18, 18, 17, 17, 16, 16, 16, 15, 15, 15] },
  // prettier-ignore
  { name: 'TypeScript', values: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  // prettier-ignore
  { name: 'C++',        values: [12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 16, 16, 16] },
  // prettier-ignore
  { name: 'Go',         values: [6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13] },
  // prettier-ignore
  { name: 'Rust',       values: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12] },
  // prettier-ignore
  { name: 'PHP',        values: [13, 13, 12, 12, 12, 11, 11, 11, 10, 10, 10, 9, 9, 9, 8, 8, 8, 7, 7, 7, 7, 6, 6, 6] },
]

export const racingData: ExampleDatum[] = languageTrends.flatMap((lang) =>
  lang.values.map((value, i) => ({
    id: `${lang.name}-${i}`,
    name: lang.name,
    series: lang.name,
    category: frames[i],
    value,
  }))
)
