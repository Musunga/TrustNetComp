"use server"

import api, { getApiErrorMessage } from "../api"
import { getAuthHeaders } from "../auth-headers"
import { API_ROUTES } from "../constants/api-routes"
import type { CertificateDetail } from "../types/certificate"

export async function fetchCertificateById(id: string): Promise<CertificateDetail> {
  const trimmed = id.trim()
  if (!trimmed) throw new Error("Missing certificate id.")

  try {
    const headers = await getAuthHeaders()
    const { data } = await api.get<CertificateDetail>(API_ROUTES.CERTIFICATES.GET(trimmed), { headers })
    return data
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err) ?? "Could not load certificate.")
  }
}
