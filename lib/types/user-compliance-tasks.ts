export interface UserComplianceTasksUser {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
}

export interface UserComplianceTaskStatus {
  id: string
  code: string
  name: string
}

export interface UserComplianceTaskRef {
  id: string
  code: string
  name?: string
  question?: string
}

export interface UserComplianceTask {
  id: string
  status: UserComplianceTaskStatus
  framework: UserComplianceTaskRef
  companyFrameworkId: string
  year: number
  function: UserComplianceTaskRef
  controlArea: UserComplianceTaskRef
  control: UserComplianceTaskRef
  assignedToComment: string | null
  reviewerStatus: string
  reviewedBy: string | null
  reviewedByComment: string | null
  completionPercentage: number
  attachedEvidence: string[]
  createdAt: string
  updatedAt: string
}

export interface UserComplianceTasksResponse {
  user: UserComplianceTasksUser
  membershipId: string
  totalTasks: number
  tasks: UserComplianceTask[]
}
