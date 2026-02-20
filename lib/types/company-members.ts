export interface CompanyMemberUser {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  jobTitle: string | null
  phoneNumber: string | null
  timezone: string | null
  bio: string | null
  avatarUrl: string | null
}

export interface CompanyMemberRole {
  id: string
  code: string
  name: string
}

export interface CompanyMember {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  user: CompanyMemberUser
  roles: CompanyMemberRole[]
}

export interface CompanyMembersStats {
  total: number
  active: number
  invited: number
  suspended: number
}

export interface CompanyMembersResponse {
  companyId: string
  members: CompanyMember[]
  stats: CompanyMembersStats
  totalMembers: number
}
