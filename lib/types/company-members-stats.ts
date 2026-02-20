export interface CompanyMembersStatsPayload {
  total: number
  active: number
  invited: number
  suspended: number
}

export interface CompanyMembersStatsResponse {
  companyId: string
  stats: CompanyMembersStatsPayload
}
