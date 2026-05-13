export interface AssessmentSummaryFramework {
  id: string
  code: string
  name: string
}

export interface AssessmentSummaryStatistics {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  compliantTasks: number
  partiallyCompliantTasks: number
  notCompliantTasks: number
}

export interface AssessmentSummaryTaskStatus {
  code: string
  name: string
}

export interface AssessmentSummaryTask {
  id: string
  controlCode: string
  controlQuestion: string
  functionName: string
  controlAreaName: string
  status: AssessmentSummaryTaskStatus
  assignedTo: unknown
  completionPercentage: number
  attachedEvidence: unknown[]
  reviewerStatus: string
  updatedAt: string
}

export interface AssessmentSummary {
  assessmentId: string
  companyId: string
  companyName: string
  framework: AssessmentSummaryFramework
  year: number
  assessmentStatus: string
  overallProgress: number
  dueDate: string | null
  statistics: AssessmentSummaryStatistics
  tasks: AssessmentSummaryTask[]
  createdAt: string
  updatedAt: string
}
