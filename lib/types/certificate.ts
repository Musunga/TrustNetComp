export interface CertificateIssuedBy {
  name: string
  email: string
}

export interface CertificateDetail {
  id: string
  status: string
  companyId: string
  companyName: string
  companyLogoUrl: string | null
  frameworkName: string
  frameworkVersion: string
  complianceYear: number
  issuedBy: CertificateIssuedBy
  issuedAt: string
  validFrom: string
  validUntil: string
  artifactUrl: string | null
  reviewerNotes: string | null
  createdAt: string
  updatedAt: string
}
