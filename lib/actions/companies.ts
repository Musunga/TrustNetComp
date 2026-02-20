"use server"

import api, { getAuthHeaders } from "../api"
import { API_ROUTES } from "../constants/api-routes"
import type { CompanyMembersStatsResponse } from "../types/company-members-stats"
import type { CompanyMembersResponse } from "../types/company-members"

export async function fetchCompanyMembersStats(
  companyId: string
): Promise<CompanyMembersStatsResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<CompanyMembersStatsResponse>(
    API_ROUTES.COMPANIES.MEMBERS_STATS(companyId),
    { headers }
  )
  return response.data
}

export async function fetchCompanyMembers(
  companyId: string
): Promise<CompanyMembersResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<CompanyMembersResponse>(
    API_ROUTES.COMPANIES.MEMBERS(companyId),
    { headers }
  )
  return response.data
}
