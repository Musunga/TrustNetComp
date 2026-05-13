import type { WalletMobileMoneyLoadResult } from "@/lib/types/wallet"

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

function pickUrl(...vals: unknown[]): string | null {
  for (const v of vals) {
    const s = typeof v === "string" ? v.trim() : ""
    if (s.startsWith("http://") || s.startsWith("https://")) return s
  }
  return null
}

function unwrapPayload(raw: unknown): Record<string, unknown> {
  const cur = asRecord(raw)
  if (!cur) return {}
  const nested =
    asRecord(cur.data) ??
    asRecord(cur.result) ??
    asRecord(cur.payload) ??
    asRecord(cur.body)
  if (nested && Object.keys(nested).length > 0) return { ...cur, ...nested }
  return cur
}

/**
 * Maps common API patterns to {@link WalletMobileMoneyLoadResult}.
 * `httpSucceeded` is true for 2xx; `ok` also respects a boolean `success` when present.
 */
export function normalizeWalletMobileMoneyLoadResponse(
  raw: unknown,
  httpSucceeded: boolean
): WalletMobileMoneyLoadResult {
  const root = unwrapPayload(raw)

  const explicitSuccess = root.success
  const ok =
    typeof explicitSuccess === "boolean"
      ? explicitSuccess && httpSucceeded
      : typeof explicitSuccess === "string"
        ? explicitSuccess.toLowerCase() === "true" && httpSucceeded
        : httpSucceeded

  const message =
    firstString(
      root.message,
      root.detail,
      root.errorMessage,
      root.error,
      root.description,
      root.reason,
      typeof root.error === "object" && root.error
        ? firstString(asRecord(root.error)?.message, asRecord(root.error)?.detail)
        : null
    ) ?? null

  const transactionId =
    firstString(root.transactionId, root.id, root.paymentId, root.payment_id, root.requestId) ?? null

  const reference =
    firstString(
      root.reference,
      root.referenceNumber,
      root.refId,
      root.ref_id,
      root.externalReference
    ) ?? null

  const externalUrl =
    pickUrl(
      root.paymentUrl,
      root.checkoutUrl,
      root.redirectUrl,
      root.url,
      root.link,
      root.authorizationUrl
    ) ?? null

  const statusCode = firstString(root.status, root.state, root.paymentStatus) ?? null

  const estimatedCredits = firstNumber(root.credits, root.creditAmount, root.estimatedCredits, root.creditsEstimated)

  const extras: Record<string, unknown> = { ...root }
  for (const key of [
    "success",
    "message",
    "detail",
    "error",
    "errorMessage",
    "description",
    "transactionId",
    "id",
    "paymentId",
    "payment_id",
    "requestId",
    "reference",
    "referenceNumber",
    "refId",
    "paymentUrl",
    "checkoutUrl",
    "redirectUrl",
    "url",
    "link",
    "status",
    "state",
  ]) {
    delete extras[key]
  }

  return {
    ok,
    message,
    transactionId,
    reference,
    externalUrl,
    statusCode,
    estimatedCredits,
    extras,
  }
}
