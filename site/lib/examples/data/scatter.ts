import type { ExampleDatum } from '../types'

/**
 * ScatterPlot 共用資料 — 產品組合分析
 * x：單價（美元）、y：月銷量（件）、z：利潤率（%）
 * → Scatter（Point，不使用 z）/ XY Bubble（z 決定泡泡大小）
 */
export const scatterData: ExampleDatum[] = [
  { series: 'Electronics', name: 'Wireless Earbuds', x: 129, y: 2400, z: 22 },
  { series: 'Electronics', name: 'Smart Watch', x: 249, y: 1350, z: 18 },
  { series: 'Electronics', name: 'Bluetooth Speaker', x: 89, y: 1900, z: 25 },
  { series: 'Electronics', name: 'Action Camera', x: 329, y: 620, z: 15 },
  { series: 'Electronics', name: 'Tablet 10"', x: 449, y: 880, z: 12 },
  { series: 'Electronics', name: 'E-Reader', x: 139, y: 760, z: 20 },
  { series: 'Electronics', name: 'Power Bank', x: 49, y: 3100, z: 30 },
  { series: 'Electronics', name: 'USB-C Hub', x: 69, y: 1450, z: 35 },
  { series: 'Apparel', name: 'Running Shoes', x: 119, y: 1800, z: 38 },
  { series: 'Apparel', name: 'Rain Jacket', x: 159, y: 720, z: 42 },
  { series: 'Apparel', name: 'Yoga Pants', x: 59, y: 2600, z: 45 },
  { series: 'Apparel', name: 'Wool Sweater', x: 99, y: 540, z: 40 },
  { series: 'Apparel', name: 'Baseball Cap', x: 29, y: 1950, z: 50 },
  { series: 'Apparel', name: 'Hiking Boots', x: 189, y: 430, z: 36 },
  { series: 'Apparel', name: 'Denim Jeans', x: 89, y: 1100, z: 41 },
  { series: 'Apparel', name: 'Sports Socks', x: 15, y: 4200, z: 52 },
  { series: 'Home', name: 'Air Purifier', x: 219, y: 680, z: 24 },
  { series: 'Home', name: 'Coffee Maker', x: 149, y: 950, z: 28 },
  { series: 'Home', name: 'Desk Lamp', x: 45, y: 1700, z: 33 },
  { series: 'Home', name: 'Throw Blanket', x: 39, y: 2100, z: 44 },
  { series: 'Home', name: 'Robot Vacuum', x: 399, y: 390, z: 16 },
  { series: 'Home', name: 'Scented Candle', x: 25, y: 2800, z: 55 },
  { series: 'Home', name: 'Wall Clock', x: 35, y: 900, z: 48 },
  { series: 'Home', name: 'Plant Pot Set', x: 32, y: 1300, z: 46 },
]
