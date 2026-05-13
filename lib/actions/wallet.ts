"use server"

import api, { getApiErrorMessage } from "../api"
import { getAuthHeaders } from "../auth-headers"
import { API_ROUTES } from "../constants/api-routes"
import type {
  CompanyWalletResponse,
  WalletFeaturePricing,
  WalletMobileMoneyLoadBody,
  WalletMobileMoneyLoadResult,
  WalletTransactionsPage,
} from "../types/wallet"
import { normalizeWalletMobileMoneyLoadResponse } from "../utils/wallet-mobile-money"
import { normalizeWalletTransactionsPage } from "../utils/wallet-transactions"

export async function fetchCompanyWallet(companyId: string): Promise<CompanyWalletResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<CompanyWalletResponse>(
    API_ROUTES.WALLET.GET_BY_COMPANY(companyId),
    { headers }
  )
  return response.data
}

export async function fetchWalletFeaturePricing(): Promise<WalletFeaturePricing[]> {
  const headers = await getAuthHeaders()
  const response = await api.get<WalletFeaturePricing[]>(API_ROUTES.WALLET.FEATURE_PRICING, {
    headers,
  })
  return response.data
}

export async function fetchWalletTransactionsPage(
  companyId: string,
  page: number,
  pageSize: number
): Promise<WalletTransactionsPage> {
  const headers = await getAuthHeaders()
  const response = await api.get<unknown>(API_ROUTES.WALLET.TRANSACTIONS(companyId), {
    headers,
    params: { page, pageSize },
  })
  const normalized = normalizeWalletTransactionsPage(response.data)
  if (!normalized) throw new Error("Unexpected wallet transactions response shape.")
  return normalized
}

export async function postWalletMobileMoneyLoad(
  companyId: string,
  body: WalletMobileMoneyLoadBody
): Promise<WalletMobileMoneyLoadResult> {
  const headers = await getAuthHeaders()
  try {
    const response = await api.post<unknown>(API_ROUTES.WALLET.LOAD_MOBILE_MONEY(companyId), body, {
      headers,
    })
    return normalizeWalletMobileMoneyLoadResponse(response.data, response.status >= 200 && response.status < 300)
  } catch (err: unknown) {
    const data = (err as { response?: { data?: unknown; status?: number } }).response?.data
    const httpOk = false
    if (data !== undefined) {
      const parsed = normalizeWalletMobileMoneyLoadResponse(data, httpOk)
      if (parsed.message || !parsed.ok)
        return {
          ...parsed,
          ok: false,
          message: parsed.message ?? getApiErrorMessage(err) ?? "Top-up request failed.",
        }
    }
    return {
      ok: false,
      message: getApiErrorMessage(err) ?? "Top-up request failed.",
      transactionId: null,
      reference: null,
      externalUrl: null,
      statusCode: null,
      estimatedCredits: null,
      extras: {},
    }
  }
}
