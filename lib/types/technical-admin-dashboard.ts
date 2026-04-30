export interface TechnicalAdminMetric {
  title: string
  value: string
  description: string
}

export interface TechnicalAdminReviewItem {
  company: string
  framework: string
  submittedAt: string
  status: string
  priority: "High" | "Medium" | "Low"
}
