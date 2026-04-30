"use server"

import api from "../api"
import { getAuthHeaders } from "../auth-headers"
import { API_ROUTES } from "../constants/api-routes"
import type { CompanyProfileResponse } from "../types/profile"

export async function fetchCompanyProfile(companyId: string): Promise<CompanyProfileResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<CompanyProfileResponse>(
    API_ROUTES.USERS.COMPANY_PROFILE(companyId),
    { headers }
  )
  return response.data
}
