import { OrbCharts } from '@orbcharts/core'
import {
  GridPlot,
  PartitionPlot,
  ScatterPlot,
  NetworkPlot,
  HierarchyPlot,
  RacingPlot,
  RankedPlot,
  CategoricalPlot,
  Legend,
  Tooltip,
} from '@orbcharts/plugin-basic'
import type { ExampleData, ExampleSpec, PluginKey } from './types'
import { exampleDataMap } from './data'

/** Plugin 名稱 → 建構子（卡片與遊樂場共用；遊樂場沙盒也注入這份表） */
export const pluginConstructors: Record<PluginKey, new (params?: never) => unknown> = {
  GridPlot,
  PartitionPlot,
  ScatterPlot,
  NetworkPlot,
  HierarchyPlot,
  RacingPlot,
  RankedPlot,
  CategoricalPlot,
  Legend,
  Tooltip,
} as never

export interface CreateChartOptions {
  /** 卡片縮小版：略過 Tooltip/Legend、racing 等互動工具 */
  preview?: boolean
  /** 覆寫資料（遊樂場編輯後使用；預設取 spec.dataKey 的共用資料） */
  data?: ExampleData
}

export interface CreatedChart {
  chart: OrbCharts
  /** 與 spec.chart.plugins 對應順序的實例（preview 模式會過濾工具類） */
  plugins: unknown[]
}

/**
 * spec → OrbCharts 實例的共用工廠。
 * 展示卡片與遊樂場都經由此函數建立圖表，保證兩邊呈現一致。
 */
export function createExampleChart(
  el: HTMLElement,
  spec: ExampleSpec,
  options: CreateChartOptions = {}
): CreatedChart {
  const pluginSpecs = options.preview
    ? spec.chart.plugins.filter((p) => p.type !== 'Tooltip' && p.type !== 'Legend')
    : spec.chart.plugins

  const plugins = pluginSpecs.map((p) => {
    const Ctor = pluginConstructors[p.type]
    let params = p.params
    if (options.preview) {
      // 預覽卡片不顯示 Legend，各 Plugin 預設為圖例保留的底部 padding 會留白過多。
      // 集中在共用工廠覆寫（僅 preview 模式），不影響遊樂場與設定檔本身。
      const styles = (params?.styles ?? {}) as { padding?: Record<string, number> }
      params = {
        ...params,
        styles: {
          ...styles,
          padding: { ...styles.padding, bottom: 50 },
        },
      }
    }
    return new Ctor(params as never)
  })

  const chart = new OrbCharts(el, {
    data: (options.data ?? exampleDataMap[spec.dataKey]) as never,
    // 網站目前僅 light 配色，鎖定避免與使用者 OS 偏好衝突
    theme: { colorScheme: 'light', ...(spec.chart.theme ?? {}) } as never,
    ...(spec.chart.encoding ? { encoding: spec.chart.encoding as never } : {}),
    plugins: plugins as never,
  })

  return { chart, plugins }
}
