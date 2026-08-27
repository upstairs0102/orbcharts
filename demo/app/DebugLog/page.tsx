'use client'

/**
 * 臨時 debug 頁（驗證資料流 emission 行為，確認後可刪除）
 * 測試三種情境：
 * 1. 訂閱後的初始 emission
 * 2. 同步 setData（與建構同一個 tick）→ 預期被 debounceTime(0) 合併
 * 3. 延遲 setData → 預期各自產生新 emission
 */
import { useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core'
import { OrbCharts } from '@orbcharts/core'
import { PartitionPlot } from '@orbcharts/plugin-basic'

const data1: RawData = [
  { series: 'A', value: 30 },
  { series: 'B', value: 70 },
  { series: 'C', value: 45 },
]
const data2: RawData = [
  { series: 'A', value: 90 },
  { series: 'B', value: 10 },
  { series: 'C', value: 50 },
]

export default function DebugLogPage() {
  const domRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const plot = new PartitionPlot({ Pie: {}, PieLabel: {} })
    const chart = new OrbCharts(domRef.current!, { data: data1, plugins: [plot] })

    let n = 0
    const subscription = chart.context.seriesData$.subscribe(() => {
      n++
      console.log('SERIES_EMIT ' + n)
    })

    // 情境 2：同步 setData（同一個 tick）
    console.log('CALL sync setData(data2)')
    chart.setData(data2)

    // 情境 3：延遲 setData
    const t1 = setTimeout(() => {
      console.log('CALL delayed setData(data1)')
      chart.setData(data1)
    }, 1000)
    const t2 = setTimeout(() => {
      console.log('CALL delayed setData(data2)')
      chart.setData(data2)
    }, 2000)
    const t3 = setTimeout(() => console.log('FINAL n=' + n), 3000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      subscription.unsubscribe()
      chart.destroy()
    }
  }, [])

  return <div ref={domRef} style={{ width: 600, height: 400 }} />
}
