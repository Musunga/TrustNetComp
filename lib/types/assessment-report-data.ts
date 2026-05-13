export interface AssessmentReportMeta {
  assessmentId: string
  companyName: string
  companyLogoUrl: string | null
  frameworkName: string
  frameworkCode: string
  complianceYear: number
  assessmentStatus: string
  type: string
  generatedAt: string
  dueDate: string | null
}

export interface AssessmentReportOverall {
  totalControls: number
  addressed: number
  partiallyAddressed: number
  notAddressed: number
  addressedPct: number
  partiallyPct: number
  notAddressedPct: number
}

export interface AssessmentReportControlAreaRow {
  code: string
  name: string
  total: number
  addressed: number
  partiallyAddressed: number
  notAddressed: number
}

export interface AssessmentReportFunctionTotals {
  total: number
  addressed: number
  partiallyAddressed: number
  notAddressed: number
}

export interface AssessmentReportFunctionPercentages {
  addressed: number
  partiallyAddressed: number
  notAddressed: number
}

export interface AssessmentReportFunctionSection {
  code: string
  name: string
  controlAreas: AssessmentReportControlAreaRow[]
  totals: AssessmentReportFunctionTotals
  percentages: AssessmentReportFunctionPercentages
}

export interface AssessmentReportMaturityLevel {
  level: number
  label: string
  description: string
}

export interface AssessmentReportData {
  meta: AssessmentReportMeta
  overall: AssessmentReportOverall
  functions: AssessmentReportFunctionSection[]
  maturityLevel: AssessmentReportMaturityLevel
  certificate: unknown | null
}
