import { api, getApiErrorMessage } from "@/lib/api"
import { API_ROUTES } from "@/lib/constants/api-routes"
import type { CertificateDetail } from "@/lib/types/certificate"

/** Runs in the browser only — uses axios + localStorage token. Never add `"use server"`. */
export async function fetchCertificateByIdClient(id: string): Promise<CertificateDetail> {
  const trimmed = id.trim()
  if (!trimmed) throw new Error("Missing certificate id.")

  try {
    const { data } = await api.get<CertificateDetail>(API_ROUTES.CERTIFICATES.GET(trimmed))
    return data
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err) ?? "Could not load certificate.")
  }
}
