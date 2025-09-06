

// RawData -> ModelData (DataEndoding & ModelType) -> RenderData (Plugin)



export type RawData = RawDataColumn[] | RawDataColumn[][] // 二維陣列會轉化為多個dataset

// 可透過 DataEncoding 更改欄位名稱的預設欄位
export type DynamicDefaultRawDataFields = {
  value?: number | null
  value0?: number | null // multivariate
  value1?: number | null // multivariate
  value2?: number | null // multivariate
  value3?: number | null // multivariate
  value4?: number | null // multivariate
  value5?: number | null // multivariate
  value6?: number | null // multivariate
  value7?: number | null // multivariate
  value8?: number | null // multivariate
  value9?: number | null // multivariate
  dataset?: string
  series?: string
  category?: string
}

export type RawDataColumn<DynamicFields extends Record<string, any> = DynamicDefaultRawDataFields> = {
  // 不可變更的基本欄位
  id?: string
  name?: string
  source?: string
  target?: string
  parent?: string
  data?: any
} & DynamicFields // 可變更的欄位



// export type DynamicRawDataColumn<
//   ValueField extends string = 'value',
//   DatasetField extends string = 'dataset', 
//   SeriesField extends string = 'series',
//   CategoryField extends string = 'category'
// > = {
//   id?: string
//   name?: string
//   source?: string
//   target?: string
//   parent?: string
//   data?: any
// } & {
//   [K in ValueField]: number | null
// } & {
//   [K in DatasetField]?: string
// } & {
//   [K in SeriesField]?: string
// } & {
//   [K in CategoryField]?: string
// }

// export type FlexibleRawDataColumn<T extends Record<string, any> = {}> = {
//   id?: string
//   value?: number | null
//   name?: string
//   dataset?: string
//   series?: string
//   category?: string
//   source?: string
//   target?: string
//   parent?: string
//   data?: any
// } & T


