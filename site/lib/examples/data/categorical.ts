import type { ExampleDatum } from '../types'

/**
 * CategoricalPlot 共用資料 — 商品評分分布（各星等的評論數）
 * 8 商品 × 5 星等 = 40 筆
 */
const ratings = ['1★', '2★', '3★', '4★', '5★']

const productRatings: { name: string; counts: number[] }[] = [
  { name: 'Laptop Pro', counts: [12, 18, 95, 320, 410] },
  { name: 'Phone X', counts: [25, 40, 130, 480, 620] },
  { name: 'Tablet S', counts: [18, 35, 110, 290, 350] },
  { name: 'Watch Fit', counts: [30, 55, 160, 380, 290] },
  { name: 'Earbuds Air', counts: [45, 70, 210, 520, 680] },
  { name: 'Speaker Mini', counts: [22, 38, 140, 310, 270] },
  { name: 'Camera Zoom', counts: [15, 28, 85, 240, 380] },
  { name: 'Drone Lite', counts: [60, 90, 180, 260, 200] },
]

export const categoricalData: ExampleDatum[] = productRatings.flatMap((product) =>
  product.counts.map((value, i) => ({
    id: `${product.name}-${i}`,
    name: product.name,
    series: product.name,
    category: ratings[i],
    value,
  }))
)
