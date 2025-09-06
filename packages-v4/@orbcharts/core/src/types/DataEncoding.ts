


export interface DataEncodingDataset {
  from: string
  sort: 'natural' | string[]
}

export interface DataEncodingSeries {
  from: string
  sort: 'natural' | string[]
}

export interface DataEncodingCategory {
  from: string
  sort: 'natural' | string[]
}

export interface DataEncodingValue {
  from: string
  sort: 'natural' | 'asc' | 'desc'
  aggregate: 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count' | 'none'
}

export type DataEncodingMultiValue = Array<{
  from: string
  label: string
}>

export interface DataEncodingColor {
  from: 'auto' | 'series' | 'category' | 'value' | 'dataset' | string // string可自由定義欄位名稱
}

export interface DataEncoding {
  dataset: DataEncodingDataset
  series: DataEncodingSeries
  category: DataEncodingCategory
  value: DataEncodingValue
  multiValue: DataEncodingMultiValue
  color: DataEncodingColor
}