'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ExampleData, ExampleDatum } from '@/lib/examples/types'

interface Props {
  data: ExampleData
  onChange: (data: ExampleData) => void
}

/** 將輸入字串轉回資料值：空字串 → null；數字字串 → number；其餘 → string */
function parseCellInput(raw: string): string | number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const num = Number(trimmed)
  if (!Number.isNaN(num) && trimmed !== '') return num
  return trimmed
}

/**
 * Excel 式資料表格 — 通用於所有範例（rows = 物件、columns = 欄位聯集）。
 * 二維資料（多 dataset）以 dataset tab 切換。
 * 編輯採 click-to-edit（單一作用中 input），即時回寫圖表。
 */
export function DataTablePanel({ data, onChange }: Props) {
  const t = useTranslations('Playground.Data')
  const is2D = Array.isArray(data[0])
  const [datasetIndex, setDatasetIndex] = useState(0)
  const [editing, setEditing] = useState<{ row: number; col: string } | null>(null)

  const datasets = useMemo(
    () => (is2D ? (data as ExampleDatum[][]) : [data as ExampleDatum[]]),
    [data, is2D]
  )
  const safeIndex = Math.min(datasetIndex, datasets.length - 1)
  const rows = datasets[safeIndex] ?? []

  const columns = useMemo(() => {
    const keys = new Set<string>()
    for (const row of rows) for (const key of Object.keys(row)) keys.add(key)
    return [...keys]
  }, [rows])

  const updateRows = (newRows: ExampleDatum[]) => {
    if (is2D) {
      const next = datasets.map((d, i) => (i === safeIndex ? newRows : d))
      onChange(next)
    } else {
      onChange(newRows)
    }
  }

  const commitCell = (rowIndex: number, col: string, raw: string) => {
    const newRows = rows.map((row, i) =>
      i === rowIndex ? { ...row, [col]: parseCellInput(raw) } : row
    )
    updateRows(newRows)
    setEditing(null)
  }

  const addRow = () => {
    const blank: ExampleDatum = {}
    for (const col of columns) blank[col] = null
    updateRows([...rows, blank])
  }

  const deleteRow = (rowIndex: number) => {
    updateRows(rows.filter((_, i) => i !== rowIndex))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2">
        {is2D && (
          <div className="flex gap-1" role="group" aria-label="Dataset">
            {datasets.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={i === safeIndex}
                onClick={() => {
                  setDatasetIndex(i)
                  setEditing(null)
                }}
                className={cn(
                  'rounded-md border px-2 py-1 text-xs font-medium',
                  i === safeIndex
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('dataset', { index: i })}
              </button>
            ))}
          </div>
        )}
        <span className="text-xs text-muted-foreground">{t('rowCount', { count: rows.length })}</span>
        <Button variant="outline" size="xs" className="ml-auto" onClick={addRow}>
          <Plus aria-hidden="true" />
          {t('addRow')}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>
              <th className="w-8 border-b px-2 py-1.5 text-left font-medium text-muted-foreground">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border-b px-2 py-1.5 text-left font-semibold text-foreground"
                >
                  {col}
                </th>
              ))}
              <th className="w-8 border-b" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group hover:bg-muted/50">
                <td className="border-b px-2 py-1 text-muted-foreground">{rowIndex + 1}</td>
                {columns.map((col) => {
                  const isEditing = editing?.row === rowIndex && editing.col === col
                  const value = row[col]
                  return (
                    <td key={col} className="border-b p-0">
                      {isEditing ? (
                        <input
                          autoFocus
                          defaultValue={value === null || value === undefined ? '' : String(value)}
                          onBlur={(e) => commitCell(rowIndex, col, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitCell(rowIndex, col, e.currentTarget.value)
                            if (e.key === 'Escape') setEditing(null)
                          }}
                          className="w-full bg-brand/5 px-2 py-1 font-mono text-xs outline-none ring-1 ring-brand"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditing({ row: rowIndex, col })}
                          className={cn(
                            'block w-full cursor-text px-2 py-1 text-left',
                            value === null || value === undefined ? 'text-muted-foreground/50' : ''
                          )}
                        >
                          {value === null || value === undefined ? '—' : String(value)}
                        </button>
                      )}
                    </td>
                  )
                })}
                <td className="border-b p-0 text-center">
                  <button
                    type="button"
                    aria-label={t('deleteRow', { index: rowIndex + 1 })}
                    onClick={() => deleteRow(rowIndex)}
                    className="px-1.5 py-1 text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
