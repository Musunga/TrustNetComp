import type {
  AssessmentControl,
  AssessmentControlArea,
  AssessmentDetail,
  AssessmentDetailFramework,
  AssessmentFunction,
  ControlProgress,
} from "@/lib/types/assessment-detail"

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

function unwrapAssessmentPayload(raw: unknown): Record<string, unknown> | null {
  const root = asRecord(raw)
  if (!root) return null

  const nestedData = asRecord(root.data)
  if (nestedData && (nestedData.id !== undefined || nestedData.uuid !== undefined)) {
    return nestedData
  }

  const enrollment = asRecord(root.enrollment)
  if (enrollment && (enrollment.id !== undefined || enrollment.uuid !== undefined)) {
    return enrollment
  }

  return root
}

function normalizeProgressString(raw: unknown): string {
  if (typeof raw === "number" && Number.isFinite(raw))
    return `${Math.min(100, Math.max(0, Math.round(raw)))}%`
  if (typeof raw === "string") return raw
  return "0%"
}

function normalizeAssignedTo(raw: unknown): string | null {
  if (raw == null || raw === "") return null
  if (typeof raw === "string") return raw
  const r = asRecord(raw)
  if (r?.id != null) return String(r.id)
  return null
}

function coerceOptionalIso(raw: unknown): string | null {
  if (raw == null || raw === "") return null
  if (typeof raw === "string") return raw
  if (typeof raw === "number" && Number.isFinite(raw)) return new Date(raw).toISOString()
  return null
}

function mapFramework(raw: unknown): AssessmentDetailFramework {
  const r = asRecord(raw) ?? {}
  const certNest = asRecord(r.certificate)
  const nestId = certNest?.id != null ? String(certNest.id) : null
  return {
    id: String(r.id ?? ""),
    code: String(r.code ?? ""),
    name: String(r.name ?? ""),
    description: typeof r.description === "string" ? r.description : String(r.description ?? ""),
    version: String(r.version ?? ""),
    effectiveDate: String(r.effectiveDate ?? r.effective_date ?? ""),
    certificateId: firstString(r.certificateId, r.certificate_id, nestId) ?? null,
  }
}

/** Renames snake_case nested keys commonly returned by `/api/frameworks/:id`. */
function mapControlProgress(raw: unknown): ControlProgress {
  const r = asRecord(raw) ?? {}
  const stat = asRecord(r.status)
  const status = {
    id: String(stat?.id ?? ""),
    code: String(stat?.code ?? ""),
    name: String(stat?.name ?? ""),
  }

  let assignedRaw: unknown = r.assignedTo ?? r.assigned_to
  if (assignedRaw === undefined || assignedRaw === null) {
    assignedRaw = r.assignedMember ?? r.assigned_member
  }

  const evidenceRaw = r.attachedEvidence ?? r.attached_evidence

  return {
    id: String(r.id ?? ""),
    status,
    assignedTo: normalizeAssignedTo(assignedRaw),
    assignedToComment: firstString(r.assignedToComment, r.assigned_to_comment) ?? null,
    reviewedBy: firstString(r.reviewedBy, r.reviewed_by),
    reviewedByComment: firstString(r.reviewedByComment, r.reviewed_by_comment) ?? null,
    completionPercentage:
      firstNumber(r.completionPercentage, r.completion_percentage, r.completion_percent) ?? 0,
    attachedEvidence: Array.isArray(evidenceRaw) ? (evidenceRaw as unknown[]) : [],
    reviewerStatus: String(r.reviewerStatus ?? r.reviewer_status ?? ""),
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    updatedAt: String(r.updatedAt ?? r.updated_at ?? ""),
  }
}

function mapControl(raw: unknown): AssessmentControl {
  const r = asRecord(raw) ?? {}
  const req =
    Array.isArray(r.requiredEvidence) ? (r.requiredEvidence as string[]) :
    Array.isArray(r.required_evidence) ? (r.required_evidence as string[]) :
    []

  return {
    id: String(r.id ?? ""),
    code: String(r.code ?? ""),
    question: String(r.question ?? ""),
    requiredEvidence: req,
    orderIndex: firstNumber(r.orderIndex, r.order_index),
    progress: mapControlProgress(r.progress ?? {}),
  }
}

function mapControlArea(raw: unknown): AssessmentControlArea {
  const r = asRecord(raw) ?? {}
  const ctrlsRaw = r.controls ?? r.controls_list
  const ctrls = Array.isArray(ctrlsRaw) ? ctrlsRaw : []
  const progressRaw = r.progress ?? null
  return {
    id: String(r.id ?? ""),
    code: String(r.code ?? ""),
    name: String(r.name ?? ""),
    description: typeof r.description === "string" ? r.description : String(r.description ?? ""),
    orderIndex: firstNumber(r.orderIndex, r.order_index),
    controls: ctrls.map(mapControl),
    progress: progressRaw ? mapControlProgress(progressRaw) : null,
  }
}

function mapAssessmentFunction(raw: unknown): AssessmentFunction {
  const r = asRecord(raw) ?? {}
  const areasRaw = r.controlAreas ?? r.control_areas
  const areas = Array.isArray(areasRaw) ? areasRaw : []
  const progressRaw = r.progress ?? null
  const orderIx = firstNumber(r.orderIndex, r.order_index)

  return {
    id: String(r.id ?? ""),
    code: String(r.code ?? ""),
    name: String(r.name ?? ""),
    description: typeof r.description === "string" ? r.description : String(r.description ?? ""),
    orderIndex: typeof orderIx === "number" ? orderIx : 0,
    controlAreas: areas.map(mapControlArea),
    progress: progressRaw ? mapControlProgress(progressRaw) : null,
  }
}

/** Normalizes `/api/frameworks/:enrollmentId` JSON (camelCase or snake_case, optional wrappers). */
export function normalizeAssessmentDetailResponse(payload: unknown): AssessmentDetail | null {
  const r = unwrapAssessmentPayload(payload)
  if (!r || (r.id === undefined && r.uuid === undefined)) return null

  const id = String(r.id ?? r.uuid ?? "")
  if (!id) return null

  const fw = mapFramework(r.framework ?? {})

  const functionsRaw =
    Array.isArray(r.functions) ? r.functions :
    Array.isArray(r.controlFunctions) ? r.controlFunctions :
    Array.isArray(r.control_functions) ? r.control_functions :
    []

  return {
    id,
    certificateId:
      firstString(r.certificateId, r.certificate_id) ?? fw.certificateId ?? null,
    companyFrameworkId: firstString(r.companyFrameworkId, r.company_framework_id) ?? undefined,
    companyId: String(r.companyId ?? r.company_id ?? ""),
    year:
      firstNumber(r.year, r.compliance_year, r.complianceYear) ?? new Date().getFullYear(),
    framework: fw,
    status: String(r.status ?? ""),
    progress: normalizeProgressString(r.progress),
    dueDate: coerceOptionalIso(r.dueDate ?? r.due_date),
    assignedTo: normalizeAssignedTo(r.assignedTo ?? r.assigned_to),
    functions: functionsRaw.map(mapAssessmentFunction),
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    updatedAt: String(r.updatedAt ?? r.updated_at ?? ""),
  }
}
