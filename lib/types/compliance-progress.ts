export interface ComplianceProgressPatchBody {
  companyId: string
  statusCode: string
  attachedEvidence: string[]
  assignedToComment: string
}

export interface AssignControlProgressBody {
  companyId: string
  memberId: string
}
