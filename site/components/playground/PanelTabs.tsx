'use client'

import { useTranslations } from 'next-intl'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ExampleData, ExampleSpec } from '@/lib/examples/types'
import type { ConsoleEntry } from '@/lib/playground/sandbox'
import type { TreePath } from '@/lib/playground/object-utils'
import { CodeMirrorEditor } from './CodeMirrorEditor'
import { ConsolePanel } from './ConsolePanel'
import { DataTablePanel } from './DataTablePanel'
import { InfoPanel } from './InfoPanel'
import { ObjectTreeEditor } from './ObjectTreeEditor'

export type TabKey = 'data' | 'encoding' | 'theme' | 'params' | 'code' | 'console' | 'info'

const TABS: TabKey[] = ['data', 'encoding', 'theme', 'params', 'code', 'console', 'info']

/** 可編輯的結構化區段 */
export type TreeSection = 'encoding' | 'theme' | 'params'

/** 自圖表實例讀回的狀態（含所有函式庫預設值） */
export interface PlaygroundReadback {
  encoding: unknown
  theme: unknown
  /** 與 spec.chart.plugins 順序對應；key = plugin 顯示名稱（重複時加序號） */
  params: { key: string; value: unknown }[]
}

export interface PanelTabsProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  spec: ExampleSpec
  exampleTitle: string
  data: ExampleData
  onDataChange: (data: ExampleData) => void
  readback: PlaygroundReadback | null
  /** 樹編輯器的編輯回呼（pluginIndex 僅 params 區段使用） */
  onTreeEdit: (section: TreeSection, pluginIndex: number, path: TreePath, value: unknown) => void
  code: string
  onCodeChange: (code: string) => void
  onRun: () => void
  consoleEntries: ConsoleEntry[]
  onClearConsole: () => void
}

/**
 * 遊樂場功能區塊（7 個 tab）— 桌機左側面板與手機底部抽屜共用。
 */
export function PanelTabs({
  activeTab,
  onTabChange,
  spec,
  exampleTitle,
  data,
  onDataChange,
  readback,
  onTreeEdit,
  code,
  onCodeChange,
  onRun,
  consoleEntries,
  onClearConsole,
}: PanelTabsProps) {
  const t = useTranslations('Playground')

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        role="tablist"
        aria-label={t('panelTitle')}
        className="flex shrink-0 gap-0.5 overflow-x-auto border-b px-2 pt-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'whitespace-nowrap rounded-t-md border-b-2 px-2.5 py-1.5 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              activeTab === tab
                ? 'border-b-brand font-semibold text-brand'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t(`Tabs.${tab}`)}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="min-h-0 flex-1">
        {activeTab === 'data' && <DataTablePanel data={data} onChange={onDataChange} />}

        {activeTab === 'encoding' && (
          <div className="flex h-full min-h-0 flex-col">
            <p className="shrink-0 border-b bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {t('Editor.hint')}
            </p>
            <ObjectTreeEditor
              value={readback?.encoding ?? {}}
              onEdit={(path, value) => onTreeEdit('encoding', 0, path, value)}
              hideRoot
              defaultOpenDepth={1}
              className="min-h-0 flex-1"
            />
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="flex h-full min-h-0 flex-col">
            <p className="shrink-0 border-b bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {t('Editor.hint')}
            </p>
            <ObjectTreeEditor
              value={readback?.theme ?? {}}
              onEdit={(path, value) => onTreeEdit('theme', 0, path, value)}
              hideRoot
              defaultOpenDepth={1}
              className="min-h-0 flex-1"
            />
          </div>
        )}

        {activeTab === 'params' && (
          <div className="flex h-full min-h-0 flex-col">
            <p className="shrink-0 border-b bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {t('Editor.paramsHint')}
            </p>
            <div className="min-h-0 flex-1 overflow-auto">
              {(readback?.params ?? []).map((plugin, pluginIndex) => (
                <section key={`${plugin.key}-${pluginIndex}`} className="border-b last:border-0">
                  <h4 className="bg-muted/50 px-3 py-1.5 font-mono text-xs font-semibold">
                    {plugin.key}
                  </h4>
                  <ObjectTreeEditor
                    value={plugin.value}
                    hideRoot
                    defaultOpenDepth={0}
                    onEdit={(path, value) => onTreeEdit('params', pluginIndex, path, value)}
                  />
                </section>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center gap-2 border-b px-3 py-1.5">
              <p className="min-w-0 truncate text-xs text-muted-foreground">{t('Code.hint')}</p>
              <Button
                size="xs"
                className="ml-auto shrink-0 bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={onRun}
              >
                <Play aria-hidden="true" />
                {t('Code.run')}
              </Button>
            </div>
            <CodeMirrorEditor value={code} onChange={onCodeChange} className="min-h-0 flex-1" />
          </div>
        )}

        {activeTab === 'console' && (
          <ConsolePanel entries={consoleEntries} onClear={onClearConsole} />
        )}

        {activeTab === 'info' && <InfoPanel spec={spec} exampleTitle={exampleTitle} />}
      </div>
    </div>
  )
}
