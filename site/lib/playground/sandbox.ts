import { OrbCharts } from '@orbcharts/core'
import { pluginConstructors } from '@/lib/examples/create-chart'
import type { ExampleData } from '@/lib/examples/types'

export interface ConsoleEntry {
  level: 'log' | 'info' | 'warn' | 'error'
  text: string
}

export interface CapturedPlugin {
  name: string
  instance: {
    getParams(): unknown
    updateParams(patch: unknown): void
  }
}

export interface SandboxResult {
  chart: OrbCharts | null
  plugins: CapturedPlugin[]
  /** 自 OrbCharts 建構子 options.data 或 setData() 攔截到的資料（資料表格同步用） */
  capturedData: ExampleData | null
  error: Error | null
}

// 不截斷輸出：Console 面板僅顯示最新一筆，單筆長度可控
function formatConsoleArg(value: unknown): string {
  if (typeof value === 'string') return value
  if (value instanceof Error) return value.message
  try {
    return (
      JSON.stringify(value, (_k, v) => (typeof v === 'function' ? `ƒ ${v.name || ''}()` : v), 2) ??
      String(value)
    )
  } catch {
    return String(value)
  }
}

/** 以 Proxy construct trap 包裝建構子（不假設其為 class 或 function） */
function wrapConstructor<T extends object>(
  Ctor: T,
  onConstruct: (instance: unknown, args: unknown[]) => void
): T {
  return new Proxy(Ctor, {
    construct(target, args) {
      const instance: object = Reflect.construct(target as new (...a: unknown[]) => object, args)
      onConstruct(instance, args)
      return instance
    },
  })
}

/**
 * 在沙盒中執行遊樂場程式碼。
 * 注入：包裝過的 OrbCharts（攔截 data）、各 Plugin 類別（攔截實例供 getParams 讀回）、
 * el（圖表容器）、console proxy（攔截輸出至 Console 面板）。
 */
export function runExampleCode(
  code: string,
  el: HTMLElement,
  onConsole: (entry: ConsoleEntry) => void
): SandboxResult {
  const capturedPlugins: CapturedPlugin[] = []
  let capturedChart: OrbCharts | null = null
  let capturedData: ExampleData | null = null

  const SandboxOrbCharts = wrapConstructor(OrbCharts as object, (instance, args) => {
    capturedChart = instance as OrbCharts
    const options = args[1] as { data?: ExampleData } | undefined
    if (options?.data) capturedData = options.data
    // 攔截 setData，讓「程式碼中改資料」也能同步回資料表格
    const inst = instance as { setData?: (data: ExampleData) => void }
    const originalSetData = inst.setData?.bind(instance)
    if (originalSetData) {
      inst.setData = (data: ExampleData) => {
        capturedData = data
        return originalSetData(data)
      }
    }
  })

  const sandboxPluginEntries = Object.entries(pluginConstructors).map(([name, Ctor]) => [
    name,
    wrapConstructor(Ctor as object, (instance) => {
      capturedPlugins.push({ name, instance: instance as CapturedPlugin['instance'] })
    }),
  ] as const)

  const proxyConsole = {
    log: (...args: unknown[]) => onConsole({ level: 'log', text: args.map(formatConsoleArg).join(' ') }),
    info: (...args: unknown[]) => onConsole({ level: 'info', text: args.map(formatConsoleArg).join(' ') }),
    warn: (...args: unknown[]) => onConsole({ level: 'warn', text: args.map(formatConsoleArg).join(' ') }),
    error: (...args: unknown[]) => onConsole({ level: 'error', text: args.map(formatConsoleArg).join(' ') }),
  }

  try {
    const fn = new Function(
      'OrbCharts',
      ...sandboxPluginEntries.map(([name]) => name),
      'el',
      'console',
      `'use strict'\n${code}`
    )
    fn(SandboxOrbCharts, ...sandboxPluginEntries.map(([, Ctor]) => Ctor), el, proxyConsole)
    return { chart: capturedChart, plugins: capturedPlugins, capturedData, error: null }
  } catch (err) {
    onConsole({ level: 'error', text: err instanceof Error ? `${err.name}: ${err.message}` : String(err) })
    return { chart: capturedChart, plugins: capturedPlugins, capturedData, error: err as Error }
  }
}
