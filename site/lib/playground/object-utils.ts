/** 物件樹編輯器的路徑/補丁工具 */

export type TreePath = (string | number)[]

/**
 * 由「目前的值 + 編輯路徑 + 新值」產生最小 patch 物件。
 * - 物件層級：只包含被編輯的 key（最小 patch）
 * - 陣列層級：回傳「完整陣列」副本（deepOverwrite 對陣列做元素覆寫，
 *   部分索引的物件 patch 會破壞陣列結構，因此一律給完整陣列）
 */
export function buildPatchAtPath(node: unknown, path: TreePath, newValue: unknown): unknown {
  if (path.length === 0) return newValue
  const [head, ...rest] = path
  if (Array.isArray(node)) {
    const copy = node.slice()
    copy[head as number] = buildPatchAtPath(node[head as number], rest, newValue)
    return copy
  }
  const current = (node as Record<string, unknown> | null | undefined)?.[head as string]
  return { [head]: buildPatchAtPath(current, rest, newValue) }
}

/** 深度合併兩個 patch（物件遞迴合併；陣列與原始值直接取代） */
export function deepMergePatch(
  base: Record<string, unknown>,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    const existing = result[key]
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      existing !== null &&
      typeof existing === 'object' &&
      !Array.isArray(existing)
    ) {
      result[key] = deepMergePatch(
        existing as Record<string, unknown>,
        value as Record<string, unknown>
      )
    } else {
      result[key] = value
    }
  }
  return result
}
