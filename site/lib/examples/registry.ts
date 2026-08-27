import type { ChartPluginKey, ExampleSpec } from './types'

/**
 * 範例總表 — 展示頁卡片與遊樂場的單一事實來源。
 * 規則提醒：Plugin 建構子參數的 key 同時決定初始顯示的 Layer
 * （傳 { Bar: {} } 只顯示 Bar；傳空物件則顯示系統預設層）。
 */
export const exampleRegistry: ExampleSpec[] = [
  // ---- GridPlot（grid）----
  {
    id: 'grid-plot-bar',
    plugin: 'GridPlot',
    titleKey: 'gridBar',
    dataKey: 'gridData',
    chart: {
      plugins: [
        { type: 'GridPlot', params: { Bar: {}, CategoryAxis: {}, ValueAxis: {}, CategoryZoom: {} } },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    id: 'grid-plot-line',
    plugin: 'GridPlot',
    titleKey: 'gridLine',
    dataKey: 'gridData',
    chart: {
      plugins: [
        {
          type: 'GridPlot',
          params: { Line: {}, Point: {}, CategoryAxis: {}, ValueAxis: {}, CategoryZoom: {} },
        },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    id: 'grid-plot-area',
    plugin: 'GridPlot',
    titleKey: 'gridArea',
    dataKey: 'gridData',
    chart: {
      plugins: [
        {
          type: 'GridPlot',
          params: { LineArea: {}, Line: {}, CategoryAxis: {}, ValueAxis: {}, CategoryZoom: {} },
        },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    id: 'grid-plot-stacked-bar',
    plugin: 'GridPlot',
    titleKey: 'gridStackedBar',
    dataKey: 'gridData',
    chart: {
      plugins: [
        {
          type: 'GridPlot',
          params: { StackedBar: {}, CategoryAxis: {}, StackedValueAxis: {}, CategoryZoom: {} },
        },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    id: 'grid-plot-triangle-bar',
    plugin: 'GridPlot',
    titleKey: 'gridTriangleBar',
    dataKey: 'gridData',
    chart: {
      plugins: [
        {
          type: 'GridPlot',
          params: { TriangleBar: {}, CategoryAxis: {}, ValueAxis: {}, CategoryZoom: {} },
        },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    // 長條+折線組合：兩個 GridPlot 實例 + 二維資料 + datasetIndex
    id: 'grid-plot-bar-line',
    plugin: 'GridPlot',
    titleKey: 'gridBarLine',
    dataKey: 'gridData',
    chart: {
      plugins: [
        {
          type: 'GridPlot',
          params: { Bar: {}, CategoryAxis: {}, ValueAxis: {}, CategoryZoom: {}, datasetIndex: 0 },
        },
        { type: 'GridPlot', params: { Line: {}, Point: {}, datasetIndex: 1 } },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },

  // ---- PartitionPlot（series）----
  {
    id: 'partition-plot-pie',
    plugin: 'PartitionPlot',
    titleKey: 'partitionPie',
    dataKey: 'partitionData',
    chart: {
      plugins: [
        { type: 'PartitionPlot', params: { Pie: {}, PieLabel: {} } },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    id: 'partition-plot-rose',
    plugin: 'PartitionPlot',
    titleKey: 'partitionRose',
    dataKey: 'partitionData',
    chart: {
      plugins: [
        { type: 'PartitionPlot', params: { Rose: {}, RoseLabel: {} } },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    id: 'partition-plot-bubble',
    plugin: 'PartitionPlot',
    titleKey: 'partitionBubble',
    dataKey: 'partitionData',
    chart: {
      plugins: [
        { type: 'PartitionPlot', params: { Bubble: {} } },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },

  // ---- ScatterPlot（multivariate）----
  {
    id: 'scatter-plot-scatter',
    plugin: 'ScatterPlot',
    titleKey: 'scatterPoint',
    dataKey: 'scatterData',
    chart: {
      plugins: [
        { type: 'ScatterPlot', params: { Point: {}, XYAxes: {}, XYGuide: {}, XZoom: {} } },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },
  {
    id: 'scatter-plot-bubble',
    plugin: 'ScatterPlot',
    titleKey: 'scatterBubble',
    dataKey: 'scatterData',
    chart: {
      plugins: [
        { type: 'ScatterPlot', params: { Bubble: {}, XYAxes: {}, XYGuide: {}, XZoom: {} } },
        { type: 'Tooltip' },
        { type: 'Legend' },
      ],
    },
  },

  // ---- NetworkPlot（graph）----
  {
    id: 'network-plot-force',
    plugin: 'NetworkPlot',
    titleKey: 'networkForce',
    dataKey: 'networkData',
    chart: {
      plugins: [{ type: 'NetworkPlot', params: { ForceDirected: {} } }, { type: 'Tooltip' }],
    },
  },
  {
    id: 'network-plot-bubble',
    plugin: 'NetworkPlot',
    titleKey: 'networkBubble',
    dataKey: 'networkData',
    chart: {
      plugins: [{ type: 'NetworkPlot', params: { ForceDirectedBubble: {} } }, { type: 'Tooltip' }],
    },
  },

  // ---- HierarchyPlot（tree）----
  {
    id: 'hierarchy-plot-treemap',
    plugin: 'HierarchyPlot',
    titleKey: 'hierarchyTreeMap',
    dataKey: 'treeData',
    chart: {
      plugins: [{ type: 'HierarchyPlot', params: { TreeMap: {} } }, { type: 'Tooltip' }],
    },
  },

  // ---- RacingPlot（grid，category = 時間幀）----
  {
    id: 'racing-plot-bar',
    plugin: 'RacingPlot',
    titleKey: 'racingBar',
    dataKey: 'racingData',
    chart: {
      plugins: [
        {
          type: 'RacingPlot',
          params: {
            RacingBar: { barRadius: 4 },
            ValueLabel: {},
            SeriesLabel: {},
            CounterText: {},
            ValueAxis: {},
            autorun: true,
            loop: true,
            frameInterval: 600,
          },
        },
        { type: 'Tooltip' },
      ],
    },
  },

  // ---- RankedPlot（grid）----
  {
    id: 'ranked-plot-bubble',
    plugin: 'RankedPlot',
    titleKey: 'rankedBubble',
    dataKey: 'rankedData',
    chart: {
      // 明確指定 Layer，確保圖軸顯示（與其他範例一致）；
      // 預設 padding.left 為 200（為長 series 標籤保留），本範例標籤短、收窄至 100
      plugins: [
        {
          type: 'RankedPlot',
          params: {
            RankedBubble: {},
            RankAxis: {},
            CategoryAxis: {},
            CategoryZoom: {},
            styles: { padding: { left: 100 } },
          },
        },
        { type: 'Tooltip' },
      ],
    },
  },

  // ---- CategoricalPlot（series）----
  {
    id: 'categorical-plot-bubble',
    plugin: 'CategoricalPlot',
    titleKey: 'categoricalBubble',
    dataKey: 'categoricalData',
    chart: {
      plugins: [
        {
          type: 'CategoricalPlot',
          params: { RaisedBubble: {}, CategoryAxis: {}, ValueAxis: {}, CategoryZoom: {} },
        },
        { type: 'Tooltip' },
      ],
    },
  },
]

/** 以 id 取得範例（找不到回傳 undefined） */
export function getExampleById(id: string): ExampleSpec | undefined {
  return exampleRegistry.find((spec) => spec.id === id)
}

/** 預設範例（遊樂場無 URL 參數時使用） */
export const defaultExample = exampleRegistry[0]

/** 依 Plugin 分組（展示頁 section 與切換選單用），保持 registry 順序 */
export function groupExamplesByPlugin(): { plugin: ChartPluginKey; examples: ExampleSpec[] }[] {
  const groups: { plugin: ChartPluginKey; examples: ExampleSpec[] }[] = []
  for (const spec of exampleRegistry) {
    const group = groups.find((g) => g.plugin === spec.plugin)
    if (group) group.examples.push(spec)
    else groups.push({ plugin: spec.plugin, examples: [spec] })
  }
  return groups
}
