"use server"

import api from "../api"
import { getAuthHeaders } from "../auth-headers"
import { API_ROUTES } from "../constants/api-routes"
import type { CompanyWalletResponse } from "../types/wallet"

export async function fetchCompanyWallet(companyId: string): Promise<CompanyWalletResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<CompanyWalletResponse>(
    API_ROUTES.WALLET.GET_BY_COMPANY(companyId),
    { headers }
  )
  console.log("Wallet balance response", response.data)
  return response.data
}
