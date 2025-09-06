export type ModelType = 'series' | 'grid' | 'multivariate' | 'graph' | 'tree'

export interface ModelDatumBase {
  id: string
  index: number // 在同類別中的索引
  name: string // 原始資料的 name 欄位
  data: any // 原始資料的 data 欄位
  value: number | null // 經過 aggregate 後的數值
  color: string // 經過色彩對應後的顏色（hex）
  // rawData: RawDataColumn // 原始資料
}

export interface ModelDatumSeries extends ModelDatumBase {
  series: string // 經過 sort 後的系列名稱
  seriesIndex: number // 系列在所有系列中的索引
}

export interface ModelDatumGrid extends ModelDatumBase {
  series: string // 經過 sort 後的系列名稱
  seriesIndex: number // 系列在所有系列中的索引
  category: string // 經過 sort 後的類別名稱
  categoryIndex: number // 類別在所有類別中的索引
}

export interface ModelDatumMultivariate extends ModelDatumBase {
  values: Array<{
    label: string // multiValue 的 label
    value: number | null // 經過 aggregate 後的數值
  }>
}

export interface ModelDatumGraphNode extends ModelDatumBase {}

export interface ModelDatumGraphEdge extends ModelDatumBase {
  source: string // 來源節點名稱
  sourceIndex: number // 來源節點在所有節點中的索引
  target: string // 目標節點名稱
  targetIndex: number // 目標節點在所有節點中的索引
}

export interface ModelDatumGraph {
  nodes: ModelDatumGraphNode[]
  edges: ModelDatumGraphEdge[]
}

export interface ModelDatumTree extends ModelDatumBase {
  parent: string | null // 父節點名稱
  parentIndex: number | null // 父節點在所有節點中的索引
  depth: number // 節點深度（根節點為 0）
  seq: number // 同一層級中的順序
  children: ModelDatumTree[] // 子節點
}

export type ModelDatum<T extends ModelType> = T extends 'series' ? ModelDatumSeries
  : T extends 'grid' ? ModelDatumGrid
  : T extends 'multiValue' ? ModelDatumMultivariate
  : T extends 'graph' ? ModelDatumGraph
  : T extends 'tree' ? ModelDatumTree
  : unknown

export type ModelData = ModelDatum<ModelType>[][]