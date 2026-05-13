import type { WalletLedgerTransaction, WalletTransactionsPage } from "@/lib/types/wallet"

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>
  return null
}

function firstString(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim()
  }
  return null
}

function firstNumber(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v)
      if (Number.isFinite(n)) return n
    }
  }
  return null
}

function flattenMeta(root: Record<string, unknown>): Record<string, unknown> {
  let out: Record<string, unknown> = { ...root }
  const meta = asRecord(root.meta)
  if (meta) out = { ...out, ...meta }
  const pagination = asRecord(root.pagination)
  if (pagination) out = { ...out, ...pagination }
  const pageInfo = asRecord(root.pageInfo)
  if (pageInfo) out = { ...out, ...pageInfo }
  const rootDataObj = asRecord(root.data)
  if (rootDataObj && !Array.isArray(root.data)) out = { ...out, ...rootDataObj }
  return out
}

function coerceItems(root: Record<string, unknown>): unknown[] | null {
  for (const key of ["items", "content", "transactions", "results", "records", "elements"]) {
    const v = root[key]
    if (Array.isArray(v)) return v
  }
  const dataVal = root.data
  if (Array.isArray(dataVal)) return dataVal
  const dataObj = asRecord(dataVal)
  if (dataObj && Array.isArray(dataObj.items)) return dataObj.items

  const nested =
    asRecord(root.results)?.items ?? asRecord(root.pagination)?.items ?? asRecord(root.payload)?.items
  if (Array.isArray(nested)) return nested

  return null
}

function mapRow(r: unknown, index: number): WalletLedgerTransaction {
  const row = asRecord(r) ?? {}
  const id = String(
    row.id ??
      row.transactionId ??
      row.walletTransactionId ??
      row.walletTransaction ??
      row.refId ??
      `tx-${index}`
  )

  const createdAt =
    firstString(
      row.createdAt,
      row.createdDate,
      row.date,
      row.timestamp,
      row.occurredAt,
      row.created_at,
      row.updatedAt,
      row.updated_at
    ) ?? null

  const description =
    firstString(
      row.description,
      row.narration,
      row.memo,
      row.details,
      row.detail,
      row.reference,
      row.referenceNumber,
      row.transactionReference,
      row.notes
    ) ?? "Transaction"

  const directionRaw =
    firstString(row.type, row.transactionType, row.direction, row.kind, row.movement) ?? null
  const direction = directionRaw ? directionRaw.toUpperCase() : null

  const amountCredits = firstNumber(
    row.amount,
    row.amountInCredits,
    row.credits,
    row.creditAmount,
    row.creditDelta,
    row.quantity,
    row.debitCredits,
    row.credit,
    row.amount_credits,
    row.credit_amount
  )

  const amountZmw = firstNumber(row.amountZmw, row.zmwAmount, row.amountInZmw, row.zmw, row.amount_zmw)

  const balanceAfterCredits = firstNumber(
    row.balanceAfter,
    row.balanceAfterCredits,
    row.closingBalance,
    row.runningBalance,
    row.balanceSnapshot,
    row.balance_after,
    row.balance_after_credits
  )

  const status = firstString(row.status, row.state, row.transactionStatus, row.transaction_status) ?? null

  return {
    id,
    createdAt,
    description,
    direction,
    amountCredits,
    amountZmw,
    status,
    balanceAfterCredits,
  }
}

/** Accepts typical Spring / Nest / custom paginated payloads and maps rows to WalletLedgerTransaction. */
export function normalizeWalletTransactionsPage(raw: unknown): WalletTransactionsPage | null {
  const root = asRecord(raw)
  if (!root) return null

  const arrays = coerceItems(root)
  if (!arrays) return null

  const meta = flattenMeta(root)
  const pageOneBased = firstNumber(meta.page, meta.pageNumber, meta.currentPage)
  const pageZeroBased = firstNumber(meta.number, meta.pageIndex, meta.pageZeroBased)
  let page = 1
  if (typeof pageOneBased === "number" && pageOneBased >= 1) page = Math.floor(pageOneBased)
  else if (typeof pageZeroBased === "number" && pageZeroBased >= 0) page = Math.floor(pageZeroBased) + 1

  const requestedSize = firstNumber(
    meta.pageSize,
    meta.size,
    meta.limit,
    meta.perPage,
    meta.page_limit
  )
  let pageSize = typeof requestedSize === "number" && requestedSize >= 1 ? requestedSize : 20

  const totalItemsCandidates = [
    meta.totalItems,
    meta.totalCount,
    meta.totalElements,
    meta.total,
    meta.recordsTotal,
    root.totalItems,
    root.totalCount,
    root.totalElements,
    root.total,
  ]
  const totalItemsGuess = firstNumber(...totalItemsCandidates)
  let totalItems = typeof totalItemsGuess === "number" && totalItemsGuess >= 0 ? totalItemsGuess : arrays.length

  const totalPagesFromApi = firstNumber(meta.totalPages, meta.numberOfPages, meta.pages, root.totalPages)

  let totalPages =
    typeof totalPagesFromApi === "number" && totalPagesFromApi >= 0
      ? Math.floor(totalPagesFromApi)
      : Math.max(0, Math.ceil(totalItems / pageSize))

  if (arrays.length === 0 && typeof totalPagesFromApi !== "number") {
    totalItems = typeof totalItemsGuess === "number" ? Math.floor(totalItemsGuess) : 0
    totalPages = Math.max(0, Math.ceil(totalItems / Math.max(1, pageSize)))
    page = totalItems === 0 ? 1 : Math.min(page, Math.max(totalPages, 1))
  }

  if (page < 1) page = 1
  if (totalPages >= 1 && page > totalPages) page = totalPages

  let effectiveTotalPages = totalPages
  if (effectiveTotalPages === 0 && totalItems > 0 && pageSize > 0) {
    effectiveTotalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  }
  const items = arrays.map(mapRow)

  return { items, page, pageSize, totalItems, totalPages: effectiveTotalPages }
}
