import type { AuthSessionI, MembershipI } from "@/lib/types/auth"
import type { AssessmentFunction } from "@/lib/types/assessment-detail"
import type { CompanyWalletResponse } from "@/lib/types/wallet"

import type { Assessment } from "@/lib/types/framework"
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants/variables"

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
  if (c === "NOT_STARTED") return "secondary"
  if (c === "IN_PROGRESS") return "warning"
  if (c === "PARTIAL") return "secondary"
  if (c === "NOT_COMPLIANT" || c === "NON_COMPLIANT") return "destructive"
  return "outline"
}

/** Assessment lifecycle is finished (issued / approved); hide send-for-review and show certificate affordance. */
export function isAssessmentWorkflowCompleted(status: string | null | undefined): boolean {
  if (status == null || typeof status !== "string" || status.trim() === "") return false
  const u = status.toUpperCase().replace(/-/g, "_").replace(/\s+/g, "_")
  if (u.includes("INCOMPLETE")) return false
  return (
    u === "COMPLETED" ||
    u === "COMPLETE" ||
    u === "DONE" ||
    u === "CERTIFIED" ||
    u === "CERTIFICATE_ISSUED" ||
    u === "APPROVED" ||
    u === "CLOSED"
  )
}

export function isCompliantComplianceStatusCode(statusCode: string): boolean {
  const c = (statusCode ?? "").toUpperCase().replace(/-/g, "_").replace(/\s+/g, "_")
  return c === "COMPLIANT" || c === "FULLY_COMPLIANT"
}

export function isControlMarkedComplete(
  completionPercentage: number | null | undefined,
  statusCode: string | undefined
): boolean {
  const pct = completionPercentage ?? 0
  if (pct >= 100) return true
  return isCompliantComplianceStatusCode(statusCode ?? "")
}

export function getFunctionControlsCompletionCounts(fn: AssessmentFunction): {
  completed: number
  total: number
} {
  let completed = 0
  let total = 0
  for (const area of fn.controlAreas ?? []) {
    for (const ctrl of area.controls ?? []) {
      total += 1
      if (isControlMarkedComplete(ctrl.progress?.completionPercentage, ctrl.progress?.status?.code)) {
        completed += 1
      }
    }
  }
  return { completed, total }
}

export function getAssessmentControlsCompletionCounts(
  functions: AssessmentFunction[] | undefined | null
): { completed: number; total: number } {
  let completed = 0
  let total = 0
  for (const fn of functions ?? []) {
    const counts = getFunctionControlsCompletionCounts(fn)
    completed += counts.completed
    total += counts.total
  }
  return { completed, total }
}

function normalizeRoleCode(raw: unknown): string {
  if (typeof raw === "number" && Number.isFinite(raw)) return normalizeRoleCode(String(raw))
  if (typeof raw !== "string") return ""
  return raw
    .trim()
    .toUpperCase()
    .replace(/[\s.-]+/g, "_")
    .replace(/_+/g, "_")
}

const TECHNICAL_ADMIN_SYNONYM_CODES = new Set([
  "TECHNICAL_ADMIN",
  "TECH_ADMIN",
  "GLOBAL_TECHNICAL_ADMIN",
  "SYSTEM_TECHNICAL_ADMIN",
])

export function roleIsTechnicalAdministrator(role: unknown): boolean {
  if (role == null) return false
  if (typeof role === "string") {
    const codeNorm = normalizeRoleCode(role)
    if (TECHNICAL_ADMIN_SYNONYM_CODES.has(codeNorm)) return true
    return Boolean(codeNorm.includes("TECHNICAL") && codeNorm.includes("ADMIN"))
  }
  if (typeof role !== "object") return false
  const r = role as Record<string, unknown>
  const codeCandidate = r.code ?? r.roleCode ?? r.slug ?? r.type ?? r.authority ?? r.role
  const codeNorm = normalizeRoleCode(codeCandidate)
  if (TECHNICAL_ADMIN_SYNONYM_CODES.has(codeNorm)) return true
  if (codeNorm.includes("TECHNICAL") && codeNorm.includes("ADMIN")) return true
  const name =
    typeof r.name === "string"
      ? r.name.toLowerCase()
      : typeof r.label === "string"
        ? r.label.toLowerCase()
        : ""
  return Boolean(name.includes("technical") && name.includes("admin"))
}

function sessionIndicatesTechnicalAdmin(authSession: AuthSessionI | null | undefined): boolean {
  if (!authSession) return false
  const check = (m: MembershipI | null | undefined) => (m?.roles ?? []).some((r) => roleIsTechnicalAdministrator(r))
  if (check(authSession.activeMembership)) return true
  return authSession.memberships?.some((m) => check(m)) ?? false
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const pad = b64.length % 4
    if (pad) b64 += "=".repeat(4 - pad)
    const json = atob(b64)
    const data = JSON.parse(json) as unknown
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function membershipsArrayIndicatesTechnicalAdmin(raw: unknown): boolean {
  if (!Array.isArray(raw)) return false
  for (const m of raw) {
    if (!m || typeof m !== "object") continue
    const roles = (m as { roles?: unknown }).roles
    if (Array.isArray(roles) && roles.some((role) => roleIsTechnicalAdministrator(role))) return true
  }
  return false
}

function jwtPayloadIndicatesTechnicalAdmin(payload: Record<string, unknown> | null): boolean {
  if (!payload) return false
  if (membershipsArrayIndicatesTechnicalAdmin(payload.memberships)) return true
  const active = payload.activeMembership
  if (active && typeof active === "object" && membershipsArrayIndicatesTechnicalAdmin([active])) return true
  const singleRole = payload.role
  if (typeof singleRole === "string" && roleIsTechnicalAdministrator(singleRole)) return true
  const topRoles = payload.roles
  if (Array.isArray(topRoles) && topRoles.some((r) => roleIsTechnicalAdministrator(r))) return true
  const authorities = payload.authorities
  if (Array.isArray(authorities) && authorities.some((a) => roleIsTechnicalAdministrator(a))) return true
  const realmAccess = payload.realm_access
  if (realmAccess && typeof realmAccess === "object") {
    const rr = (realmAccess as { roles?: unknown }).roles
    if (Array.isArray(rr) && rr.some((r) => roleIsTechnicalAdministrator(r))) return true
  }
  return false
}

export function authSessionIsTechnicalAdmin(authSession: AuthSessionI | null | undefined): boolean {
  if (sessionIndicatesTechnicalAdmin(authSession)) return true
  if (typeof window === "undefined") return false
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_COOKIE_NAME)
    if (token && jwtPayloadIndicatesTechnicalAdmin(parseJwtPayload(token))) return true
  } catch {
    /* localStorage unavailable (e.g. private mode restrictions) */
  }
  return false
}

export function membershipHasRole(
  membership: MembershipI | null | undefined,
  roleCode: string
): boolean {
  const expected = normalizeRoleCode(roleCode)
  return membership?.roles?.some((role) => normalizeRoleCode(role.code) === expected) ?? false
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

export function resolveCompanyFrameworkEnrollmentId(assessment: Assessment): string {
  const explicit = assessment.companyFrameworkId?.trim()
  if (explicit) return explicit
  return assessment.id
}

const ORDINAL_SUFFIX = (day: number): string => {
  const j = day % 10
  const k = day % 100
  if (k >= 11 && k <= 13) return `${day}TH`
  if (j === 1) return `${day}ST`
  if (j === 2) return `${day}ND`
  if (j === 3) return `${day}RD`
  return `${day}TH`
}

/** e.g. "13TH MAY 2027" for certificate footer (UTC from ISO). */
export function formatCertificateOrdinalDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return "—"
    const day = d.getUTCDate()
    const month = d
      .toLocaleString("en-GB", { month: "short", timeZone: "UTC" })
      .toUpperCase()
    const year = d.getUTCFullYear()
    return `${ORDINAL_SUFFIX(day)} ${month} ${year}`
  } catch {
    return "—"
  }
}
