export interface CompanyInvitationRole {
  id: string
  code: string
  name: string
}

export interface CompanyInvitationInvitedBy {
  id: string
  name: string
  email: string
}

export interface CompanyInvitation {
  id: string
  email: string
  role: CompanyInvitationRole
  invitedBy: CompanyInvitationInvitedBy
  status: string
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface CompanyInvitationsResponse {
  companyId: string
  invitations: CompanyInvitation[]
  total: number
}
