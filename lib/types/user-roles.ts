export interface UserRole {
  id: string
  code: string
  name: string
}

export interface UserRolesResponse {
  roles: UserRole[]
}
