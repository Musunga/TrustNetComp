"use server"

import api, { getApiErrorMessage } from "../api"
import { getAuthHeaders } from "../auth-headers"
import { API_ROUTES } from "../constants/api-routes"
import type {
  AssistedAssessmentAllRequestsApiResponse,
  AssistedAssessmentEngagementsPage,
} from "../types/assisted-assessment-engagements"
import type { AssistedAssessmentRequestBody } from "../types/assisted-assessment"
import { normalizeAssistedAssessmentEngagementsPage } from "../utils/assisted-assessment-engagements"

export async function fetchAssistedAssessmentEngagementsPage(
  page: number,
  pageSize: number
): Promise<AssistedAssessmentEngagementsPage> {
  const headers = await getAuthHeaders()
  const response = await api.get<AssistedAssessmentAllRequestsApiResponse>(
    API_ROUTES.ASSISTED_ASSESSMENTS.ALL_REQUESTS,
    {
      headers,
      params: { page, pageSize },
    }
  )
  const normalized = normalizeAssistedAssessmentEngagementsPage(response.data)
  if (!normalized) throw new Error("Unexpected assisted assessment requests response.")
  return normalized
}

export async function requestAssistedAssessment(body: AssistedAssessmentRequestBody): Promise<void> {
  const headers = await getAuthHeaders()
  try {
   await api.post(API_ROUTES.ASSISTED_ASSESSMENTS.REQUEST, body, { headers })
  } catch (e) {
    const msg = getApiErrorMessage(e) ?? "Could not submit assisted assessment."
    throw new Error(msg)
  }
}
