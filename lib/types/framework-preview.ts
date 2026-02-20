export interface FrameworkPreviewControl {
  id: string
  code: string
  question: string
  requiredEvidence: string[]
  orderIndex: number | null
}

export interface FrameworkPreviewControlArea {
  id: string
  code: string
  name: string
  description: string
  orderIndex: number | null
  controls: FrameworkPreviewControl[]
}

export interface FrameworkPreviewFunction {
  id: string
  code: string
  name: string
  description: string
  orderIndex: number
  controlAreas: FrameworkPreviewControlArea[]
}

export interface FrameworkPreviewResponse {
  id: string
  code: string
  name: string
  description: string
  version: string
  effectiveDate: string
  isCustom: boolean
  functions: FrameworkPreviewFunction[]
}
