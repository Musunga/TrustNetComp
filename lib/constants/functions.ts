import type { AuthSessionI, MembershipI } from "@/lib/types/auth"
import type { CompanyWalletResponse } from "@/lib/types/wallet"

export function formatDate(d: Date | string): string {
    const date = typeof d === "string" ? new Date(d) : d
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }
  

 export function parseProgress(progress: string): number {
    if (typeof progress !== "string") return 0
    const num = parseInt(progress.replace(/%/g, "").trim(), 10)
    return Number.isNaN(num) ? 0 : Math.min(100, Math.max(0, num))
  }
  
  export function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "warning" | "bg-gray-300"   {
    const s = status?.toUpperCase() ?? ""
    if (s === "COMPLETED" || s === "DONE") return "default"
    if (s === "IN_PROGRESS" || s === "IN PROGRESS") return "warning"
    if (s === "ACTIVE") return "secondary"
    if (s === "OVERDUE" || s === "FAILED") return "destructive"
    return "outline"
  }

export function complianceStatusVariant(
  code: string
): "default" | "secondary" | "destructive" | "success" | "outline" | "warning" {
  const c = (code ?? "").toUpperCase().replace(/-/g, "_").replace(/\s+/g, "_")
  if (c === "COMPLIANT" || c === "FULLY_COMPLIANT") return "success"
  if (c === "IN_PROGRESS") return "warning"
  if (c === "PARTIAL") return "secondary"
  if (c === "NOT_COMPLIANT" || c === "NON_COMPLIANT") return "destructive"
  return "outline"
}

export function membershipHasRole(
  membership: MembershipI | null | undefined,
  roleCode: string
): boolean {
  const expectedRole = roleCode.toUpperCase()
  return membership?.roles?.some((role) => role.code?.toUpperCase() === expectedRole) ?? false
}

export function authSessionHasRole(
  authSession: AuthSessionI | null | undefined,
  roleCode: string
): boolean {
  if (!authSession) return false
  if (membershipHasRole(authSession.activeMembership, roleCode)) return true
  return authSession.memberships?.some((membership) => membershipHasRole(membership, roleCode)) ?? false
}

export function getWalletCreditBalance(wallet: CompanyWalletResponse | null | undefined): number | null {
  return typeof wallet?.balance === "number" ? wallet.balance : null
}

export function formatCreditBalance(balance: number | null): string {
  if (balance === null) return "—"
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(balance)
}

export function formatZmwAmount(amount: number | null | undefined): string {
  if (typeof amount !== "number") return "—"
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "ZMW",
    maximumFractionDigits: 2,
  }).format(amount)
}
