import type { RoleI } from "./auth"

export interface ProfileUser {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  jobTitle: string | null
  phoneNumber: string | null
  timezone: string | null
  bio: string | null
  avatarUrl: string | null
  hasToured: boolean
  createdAt: string
  updatedAt: string
  roles: RoleI[]
}

export interface ProfileMembership {
  id: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProfileCompany {
  id: string
  name: string
}

export interface CompanyProfileResponse {
  user: ProfileUser
  membership: ProfileMembership
  company: ProfileCompany
}
