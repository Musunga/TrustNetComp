export interface CreateInvitationBody {
  emails: string[]
  roleCode: string
  companyId: string
  expiresInDays: number
}

export interface DeleteInvitationBody {
  companyId: string
}

export interface ResendInvitationBody {
  companyId: string
}

export interface AcceptInvitationBody {
  token: string
  firstName: string
  lastName: string
  password: string
  phoneNumber: string
  jobTitle: string
  timezone: string
  bio: string
}
