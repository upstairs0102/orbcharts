'use client'

import { cn } from '@/lib/utils'
import type { TreePath } from '@/lib/playground/object-utils'

interface Props {
  value: unknown
  onEdit: (path: TreePath, value: unknown) => void
  /** 預設展開的深度 */
  defaultOpenDepth?: number
  /** 不渲染樹根的摺疊列（{n}），頂層欄位直接平鋪 */
  hideRoot?: boolean
  /** 頂層 key 的顯示格式化（如 layer 名稱加上 [] 標示）；不影響編輯路徑 */
  formatRootKey?: (key: string) => string
  className?: string
}

/**
 * 通用物件樹編輯器 — Encoding / Theme / Plugin Params 的動態編輯介面。
 * 結構由值本身推導（零寫死），依型別決定控件：
 * - boolean → checkbox、number → 數字輸入、string/null → 文字輸入
 * - 物件 / 陣列 → 摺疊子樹（陣列項目可編輯，長度不可增減）
 * - 函式 → 唯讀（請於 Source Code 編輯）
 * 輸入值的型別規則：原值為 number 只接受數字；原值為 null 時空字串維持 null；
 * 純數字字串會轉成 number（與資料表格一致）。
 */
export function ObjectTreeEditor({
  value,
  onEdit,
  defaultOpenDepth = 2,
  hideRoot = false,
  formatRootKey,
  className,
}: Props) {
  const isRootObject = value !== null && typeof value === 'object' && !Array.isArray(value)

  return (
    <div className={cn('overflow-auto p-3 font-mono text-xs leading-relaxed', className)}>
      {hideRoot && isRootObject ? (
        Object.entries(value as Record<string, unknown>).map(([key, child]) => (
          <EditorNode
            key={key}
            name={String(key)}
            displayName={formatRootKey ? formatRootKey(key) : String(key)}
            value={child}
            path={[key]}
            depth={0}
            defaultOpenDepth={defaultOpenDepth}
            onEdit={onEdit}
          />
        ))
      ) : (
        <EditorNode
          value={value}
          path={[]}
          depth={0}
          defaultOpenDepth={defaultOpenDepth}
          onEdit={onEdit}
        />
      )}
    </div>
  )
}

function parseInputValue(raw: string, original: unknown): unknown {
  const trimmed = raw.trim()
  if (typeof original === 'number') {
    const num = Number(trimmed)
    return Number.isFinite(num) && trimmed !== '' ? num : original
  }
  if (original === null && trimmed === '') return null
  if (trimmed !== '' && !Number.isNaN(Number(trimmed))) return Number(trimmed)
  return raw
}

function LeafEditor({
  value,
  path,
  onEdit,
}: {
  value: unknown
  path: TreePath
  onEdit: (path: TreePath, value: unknown) => void
}) {
  const dataPath = path.join('.')

  if (typeof value === 'boolean') {
    return (
      <input
        type="checkbox"
        data-path={dataPath}
        checked={value}
        onChange={(e) => onEdit(path, e.target.checked)}
        className="size-3.5 accent-[var(--brand)] align-middle"
      />
    )
  }

  if (typeof value === 'function') {
    return (
      <span className="italic text-muted-foreground" title={value.toString()}>
        ƒ {value.name || '(anonymous)'}
      </span>
    )
  }

  // string / number / null：文字輸入（key 綁定值，readback 刷新後自動重新同步）
  const display = value === null || value === undefined ? '' : String(value)
  return (
    <input
      key={display}
      type="text"
      data-path={dataPath}
      defaultValue={display}
      placeholder={value === null ? 'null' : undefined}
      onBlur={(e) => {
        if (e.target.value !== display) onEdit(path, parseInputValue(e.target.value, value))
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          e.currentTarget.value = display
          e.currentTarget.blur()
        }
      }}
      className={cn(
        'rounded border bg-background px-1.5 py-0.5 font-mono text-xs',
        typeof value === 'number' ? 'w-20' : 'w-40 max-w-full'
      )}
    />
  )
}

function EditorNode({
  value,
  name,
  displayName,
  path,
  depth,
  defaultOpenDepth,
  onEdit,
}: {
  value: unknown
  name?: string
  /** 顯示用名稱（預設同 name；頂層 layer key 會帶 [] 標示） */
  displayName?: string
  path: TreePath
  depth: number
  defaultOpenDepth: number
  onEdit: (path: TreePath, value: unknown) => void
}) {
  const isObject = value !== null && typeof value === 'object'
  const shownName = displayName ?? name

  if (!isObject) {
    return (
      <div className="flex items-center gap-2 py-0.5">
        {shownName !== undefined && (
          <span className="shrink-0 text-muted-foreground">{shownName}:</span>
        )}
        <LeafEditor value={value} path={path} onEdit={onEdit} />
      </div>
    )
  }

  const entries = Array.isArray(value)
    ? (value as unknown[]).map((v, i) => [i, v] as const)
    : Object.entries(value as Record<string, unknown>).map(
        ([k, v]) => [k, v] as const
      )
  const label = Array.isArray(value) ? `[${entries.length}]` : `{${entries.length}}`

  if (entries.length === 0) {
    return (
      <div className="py-0.5">
        {shownName !== undefined && (
          <span className="text-muted-foreground">{shownName}: </span>
        )}
        <span className="text-muted-foreground/60">{Array.isArray(value) ? '[]' : '{}'}</span>
      </div>
    )
  }

  return (
    <details open={depth < defaultOpenDepth} className="py-0.5">
      <summary className="cursor-pointer select-none rounded hover:bg-muted/50">
        {shownName !== undefined && (
          <span className="text-muted-foreground">{shownName}: </span>
        )}
        <span className="text-muted-foreground/70">{label}</span>
      </summary>
      <div className="ml-4 border-l border-border/60 pl-3">
        {entries.map(([key, child]) => (
          <EditorNode
            key={key}
            name={String(key)}
            value={child}
            path={[...path, key]}
            depth={depth + 1}
            defaultOpenDepth={defaultOpenDepth}
            onEdit={onEdit}
          />
        ))}
      </div>
    </details>
  )
}
