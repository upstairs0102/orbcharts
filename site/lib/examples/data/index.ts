import type { ExampleData, ExampleDataKey } from '../types'
import { gridData } from './grid'
import { partitionData } from './partition'
import { scatterData } from './scatter'
import { networkData } from './network'
import { treeData } from './tree'
import { racingData } from './racing'
import { rankedData } from './ranked'
import { categoricalData } from './categorical'

/** 共用資料總表 — ExampleSpec.dataKey 由此解析 */
export const exampleDataMap: Record<ExampleDataKey, ExampleData> = {
  gridData,
  partitionData,
  scatterData,
  networkData,
  treeData,
  racingData,
  rankedData,
  categoricalData,
}

export {
  gridData,
  partitionData,
  scatterData,
  networkData,
  treeData,
  racingData,
  rankedData,
  categoricalData,
}
