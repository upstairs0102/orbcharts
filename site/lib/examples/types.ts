/**
 * 範例設定檔型別 — 展示頁與遊樂場共用的單一事實來源。
 * 設計原則見 docs-ai/demo-playground-plan.md。
 */

/** 所有可用的 Plugin 名稱（與 @orbcharts/plugin-basic exports 一致） */
export type PluginKey =
  | 'GridPlot'
  | 'PartitionPlot'
  | 'ScatterPlot'
  | 'NetworkPlot'
  | 'HierarchyPlot'
  | 'RacingPlot'
  | 'RankedPlot'
  | 'CategoricalPlot'
  | 'Legend'
  | 'Tooltip'

/** 圖表類 Plugin（範例分組用，不含工具類） */
export type ChartPluginKey = Exclude<PluginKey, 'Legend' | 'Tooltip'>

/** OrbCharts 的五種資料格式 */
export type DataFormat = 'series' | 'grid' | 'multivariate' | 'graph' | 'tree'

/** 範例資料的單筆物件（RawDataColumn 的子集） */
export type ExampleDatum = Record<string, string | number | null>

/** 一維（單 dataset）或二維（多 dataset）資料 */
export type ExampleData = ExampleDatum[] | ExampleDatum[][]

/** Plugin 宣告：params 的 key 同時決定初始顯示的 Layer（OrbCharts 規則） */
export interface PluginSpec {
  type: PluginKey
  params?: Record<string, unknown>
}

/** 單一範例的完整定義 */
export interface ExampleSpec {
  /** URL 參數識別字（kebab-case），如 'grid-plot-bar' */
  id: string
  /** 所屬圖表 Plugin（展示頁分組） */
  plugin: ChartPluginKey
  /** i18n key（Demo.Examples 命名空間） */
  titleKey: string
  /** 指向 data/ 下的共用資料 */
  dataKey: ExampleDataKey
  chart: {
    plugins: PluginSpec[]
    encoding?: Record<string, unknown>
    theme?: Record<string, unknown>
  }
}

/** 共用資料的 key（與 data/index.ts 的 exampleDataMap 對應） */
export type ExampleDataKey =
  | 'gridData'
  | 'partitionData'
  | 'scatterData'
  | 'networkData'
  | 'treeData'
  | 'racingData'
  | 'rankedData'
  | 'categoricalData'

/** 各圖表 Plugin 的中繼資料（說明 tab 與展示頁 tag 用，文件連結由此推導） */
export const pluginMeta: Record<ChartPluginKey, { dataFormat: DataFormat; docsSlug: string }> = {
  GridPlot: { dataFormat: 'grid', docsSlug: 'grid-plot' },
  PartitionPlot: { dataFormat: 'series', docsSlug: 'partition-plot' },
  ScatterPlot: { dataFormat: 'multivariate', docsSlug: 'scatter-plot' },
  NetworkPlot: { dataFormat: 'graph', docsSlug: 'network-plot' },
  HierarchyPlot: { dataFormat: 'tree', docsSlug: 'hierarchy-plot' },
  RacingPlot: { dataFormat: 'grid', docsSlug: 'racing-plot' },
  RankedPlot: { dataFormat: 'grid', docsSlug: 'ranked-plot' },
  CategoricalPlot: { dataFormat: 'series', docsSlug: 'categorical-plot' },
}
