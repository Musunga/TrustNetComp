export interface AssistedAssessmentEngagementCompany {
  id: string
  name: string
  logoUrl: string | null
}

export interface AssistedAssessmentEngagementFramework {
  id: string
  name: string
  code: string | null
}

export interface AssistedAssessmentEngagementParty {
  id: string
  name: string
  email: string | null
}

export interface AssistedAssessmentEngagementAssignedMember {
  id: string | null
  name: string | null
  email: string | null
}

export interface AssistedAssessmentEngagementProgress {
  totalControls: number
  completedControls: number
  notCompletedControls: number
  percentage: number
}

export interface AssistedAssessmentEngagement {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  reviewComment: string | null
  company: AssistedAssessmentEngagementCompany
  framework: AssistedAssessmentEngagementFramework
  companyFrameworkId: string
  progress: AssistedAssessmentEngagementProgress
  requestedBy: AssistedAssessmentEngagementParty
  assignedMembers: AssistedAssessmentEngagementAssignedMember[]
}

export interface AssistedAssessmentEngagementsPage {
  items: AssistedAssessmentEngagement[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AssistedAssessmentAllRequestsPaginationDto {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AssistedAssessmentAllRequestsApiResponse {
  engagements: unknown[]
  pagination: AssistedAssessmentAllRequestsPaginationDto
}
