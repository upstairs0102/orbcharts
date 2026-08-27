import type { ExampleData, ExampleSpec, PluginSpec } from './types'
import { exampleDataMap } from './data'

/**
 * spec → 程式碼字串。
 * - 'playground'：遊樂場執行用（無 import，使用注入的 el / Plugin 類別）
 * - 'standalone'：說明 tab 的最小可執行程式碼（含 import，可直接複製到專案）
 */
/** 遊樂場結構化編輯（Encoding/Theme/Params 樹編輯器）累積的 patch */
export interface CodegenPatches {
  encoding?: Record<string, unknown>
  theme?: Record<string, unknown>
  /** key = spec.chart.plugins 的索引 */
  params?: Record<number, Record<string, unknown>>
}

export interface CodegenOptions {
  mode: 'playground' | 'standalone'
  /** 覆寫資料（遊樂場編輯後重新產生程式碼用） */
  data?: ExampleData
  /** 結構化編輯的 patch（以 updateEncoding/updateTheme/updateParams 形式輸出） */
  patches?: CodegenPatches
}

const IDENT_RE = /^[A-Za-z_$][\w$]*$/

function serializeKey(key: string): string {
  return IDENT_RE.test(key) ? key : `'${key.replace(/'/g, "\\'")}'`
}

/** 將值序列化為 JS 字面值（支援函式：toString；設定檔內函式需為 self-contained arrow function） */
export function serializeValue(value: unknown, indentLevel = 0): string {
  const indent = '  '.repeat(indentLevel)
  const childIndent = '  '.repeat(indentLevel + 1)

  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'function') return value.toString()

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const allPrimitive = value.every(
      (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v)
    )
    if (allPrimitive) {
      return `[${value.map((v) => serializeValue(v)).join(', ')}]`
    }
    const items = value.map((v) => `${childIndent}${serializeValue(v, indentLevel + 1)},`)
    return `[\n${items.join('\n')}\n${indent}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const lines = entries.map(
      ([k, v]) => `${childIndent}${serializeKey(k)}: ${serializeValue(v, indentLevel + 1)},`
    )
    return `{\n${lines.join('\n')}\n${indent}}`
  }

  return String(value)
}

/** 資料列以單行物件呈現（表格感、易讀） */
function serializeDataRow(row: Record<string, unknown>): string {
  const fields = Object.entries(row)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${serializeKey(k)}: ${serializeValue(v)}`)
  return `{ ${fields.join(', ')} }`
}

function serializeData(data: ExampleData): string {
  const is2D = Array.isArray(data[0])
  if (is2D) {
    const datasets = (data as Record<string, unknown>[][]).map((dataset) => {
      const rows = dataset.map((row) => `    ${serializeDataRow(row)},`).join('\n')
      return `  [\n${rows}\n  ],`
    })
    return `const data = [\n${datasets.join('\n')}\n]`
  }
  const rows = (data as Record<string, unknown>[])
    .map((row) => `  ${serializeDataRow(row)},`)
    .join('\n')
  return `const data = [\n${rows}\n]`
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

/** 為每個 plugin 產生不重複的變數名稱（gridPlot, gridPlot2, ...） */
export function pluginVarNames(plugins: PluginSpec[]): string[] {
  const counts: Record<string, number> = {}
  return plugins.map((p) => {
    const base = lowerFirst(p.type)
    counts[base] = (counts[base] ?? 0) + 1
    return counts[base] === 1 ? base : `${base}${counts[base]}`
  })
}

export function generateExampleCode(spec: ExampleSpec, options: CodegenOptions): string {
  const data = options.data ?? exampleDataMap[spec.dataKey]
  const varNames = pluginVarNames(spec.chart.plugins)

  const pluginLines = spec.chart.plugins.map((p, i) => {
    const hasParams = p.params && Object.keys(p.params).length > 0
    const args = hasParams ? serializeValue(p.params, 0) : ''
    return `const ${varNames[i]} = new ${p.type}(${args})`
  })

  const chartOptionLines = ['  data,']
  if (spec.chart.encoding && Object.keys(spec.chart.encoding).length > 0) {
    chartOptionLines.push(`  encoding: ${serializeValue(spec.chart.encoding, 1)},`)
  }
  if (spec.chart.theme && Object.keys(spec.chart.theme).length > 0) {
    chartOptionLines.push(`  theme: ${serializeValue(spec.chart.theme, 1)},`)
  }
  chartOptionLines.push(`  plugins: [${varNames.join(', ')}],`)

  const elExpr =
    options.mode === 'standalone' ? `document.querySelector('#chart')` : 'el'

  const blocks: string[] = []

  if (options.mode === 'standalone') {
    // 與文件安裝頁一致：以 orbcharts 統包為主（re-export core + plugin-basic 全部 API）
    const pluginTypes = [...new Set(spec.chart.plugins.map((p) => p.type))]
    blocks.push(`import { OrbCharts, ${pluginTypes.join(', ')} } from 'orbcharts'`)
  } else {
    blocks.push('// 可用變數：OrbCharts、各 Plugin 類別、el（圖表容器）、console')
  }

  blocks.push(serializeData(data))
  blocks.push(pluginLines.join('\n'))
  blocks.push(`const chart = new OrbCharts(${elExpr}, {\n${chartOptionLines.join('\n')}\n})`)

  // 結構化編輯的 patch：以執行期 API 輸出（不混入建構子參數，避免影響初始 Layer 顯示）
  const patches = options.patches
  if (patches?.encoding && Object.keys(patches.encoding).length > 0) {
    blocks.push(`chart.updateEncoding(${serializeValue(patches.encoding, 0)})`)
  }
  if (patches?.theme && Object.keys(patches.theme).length > 0) {
    blocks.push(`chart.updateTheme(${serializeValue(patches.theme, 0)})`)
  }
  if (patches?.params) {
    for (const [index, patch] of Object.entries(patches.params)) {
      if (patch && Object.keys(patch).length > 0 && varNames[Number(index)]) {
        blocks.push(`${varNames[Number(index)]}.updateParams(${serializeValue(patch, 0)})`)
      }
    }
  }

  if (options.mode === 'playground') {
    // 訂閱事件流（互動事件的輸出會顯示在 Console 分頁）
    blocks.push(`chart.context.event$.subscribe(event => {\n  console.log(event)\n})`)
  }

  return blocks.join('\n\n') + '\n'
}
