import type {
  AssistedAssessmentEngagement,
  AssistedAssessmentEngagementProgress,
  AssistedAssessmentEngagementsPage,
  AssistedAssessmentEngagementParty,
} from "@/lib/types/assisted-assessment-engagements"

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

function mapParty(raw: unknown): AssistedAssessmentEngagementParty {
  const r = asRecord(raw) ?? {}
  return {
    id: String(r.id ?? ""),
    name: firstString(r.name, r.fullName) ?? "—",
    email: firstString(r.email, r.emailAddress) ?? null,
  }
}

function mapProgress(raw: unknown): AssistedAssessmentEngagementProgress {
  const r = asRecord(raw) ?? {}
  const totalControls = firstNumber(r.totalControls, r.total_controls) ?? 0
  const completedControls = firstNumber(r.completedControls, r.completed_controls) ?? 0
  const notCompletedControls =
    firstNumber(r.notCompletedControls, r.not_completed_controls) ??
    Math.max(0, totalControls - completedControls)
  const pctRaw = firstNumber(r.percentage, r.percent) ?? 0
  const percentage = Math.min(100, Math.max(0, Number.isFinite(pctRaw) ? pctRaw : 0))

  return {
    totalControls: Math.max(0, Math.floor(totalControls)),
    completedControls: Math.max(0, Math.floor(completedControls)),
    notCompletedControls: Math.max(0, Math.floor(notCompletedControls)),
    percentage,
  }
}

function mapEngagement(row: unknown, index: number): AssistedAssessmentEngagement {
  const r = asRecord(row) ?? {}
  const company = asRecord(r.company) ?? {}
  const framework = asRecord(r.framework) ?? {}
  const assigned = Array.isArray(r.assignedMembers) ? r.assignedMembers : []

  return {
    id: String(r.id ?? `eng-${index}`),
    status: String(firstString(r.status, r.state) ?? "UNKNOWN"),
    createdAt: firstString(r.createdAt, r.created_at) ?? "",
    updatedAt: firstString(r.updatedAt, r.updated_at) ?? "",
    reviewComment:
      r.reviewComment === null || r.review_comment === null
        ? null
        : firstString(r.reviewComment, r.review_comment),
    company: {
      id: String(company.id ?? ""),
      name: firstString(company.name) ?? "—",
      logoUrl: company.logoUrl == null ? null : firstString(company.logoUrl, company.logo_url),
    },
    framework: {
      id: String(framework.id ?? ""),
      name: firstString(framework.name) ?? "—",
      code: framework.code == null ? null : firstString(framework.code, framework.slug),
    },
    companyFrameworkId: String(
      r.companyFrameworkId ?? r.company_framework_id ?? r.companyFramework?.id ?? ""
    ),
    progress: mapProgress(r.progress),
    requestedBy: mapParty(r.requestedBy ?? r.requested_by ?? r.requester),
    assignedMembers: assigned.map((m) => {
      const ar = asRecord(m) ?? {}
      return {
        id: firstString(ar.id) ?? null,
        name: firstString(ar.name) ?? null,
        email: firstString(ar.email) ?? null,
      }
    }),
  }
}


export function normalizeAssistedAssessmentEngagementsPage(data: unknown): AssistedAssessmentEngagementsPage | null {
  const root = asRecord(data)
  if (!root) return null

  const engagementsRaw =
    Array.isArray(root.engagements) ? root.engagements :
    Array.isArray(root.items) ? root.items :
    Array.isArray(root.data) ? root.data :
    asRecord(root.data) && Array.isArray(asRecord(root.data)?.engagements)
      ? (asRecord(root.data)?.engagements as unknown[])
      : null

  if (!engagementsRaw) return null

  const pag = asRecord(root.pagination)
  const meta = asRecord(root.meta)
  const totalItems =
    firstNumber(
      pag?.total,
      pag?.totalCount,
      pag?.totalElements,
      meta?.total,
      meta?.totalCount,
      meta?.totalElements,
      root.total,
      root.totalCount,
      root.totalElements
    ) ??
    engagementsRaw.length
  const page =
    firstNumber(
      pag?.page,
      pag?.currentPage,
      pag?.pageNumber,
      meta?.page,
      meta?.currentPage,
      meta?.pageNumber,
      root.page
    ) ?? 1
  const pageSize =
    firstNumber(
      pag?.pageSize,
      pag?.limit,
      pag?.size,
      pag?.page_size,
      meta?.pageSize,
      meta?.limit,
      meta?.size,
      root.pageSize
    ) ?? Math.max(1, engagementsRaw.length)
  const totalPagesFromApi = firstNumber(
    pag?.totalPages,
    pag?.total_pages,
    meta?.totalPages,
    root.totalPages
  )
  const fallbackPages =
    totalItems <= 0 ? 0 : Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)))
  const totalPages =
    typeof totalPagesFromApi === "number" && totalPagesFromApi >= 0
      ? Math.floor(totalPagesFromApi)
      : fallbackPages

  return {
    items: engagementsRaw.map(mapEngagement),
    totalItems,
    page,
    pageSize,
    totalPages,
  }
}
