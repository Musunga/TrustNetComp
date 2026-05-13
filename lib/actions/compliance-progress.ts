"use server"

import api, { getApiErrorMessage } from "../api"
import { getAuthHeaders } from "../auth-headers"
import { API_ROUTES } from "../constants/api-routes"
import type {
  AssignControlProgressBody,
  SubmitAssessmentForReviewBody,
} from "../types/compliance-progress"
import type { UserComplianceTasksResponse } from "../types/user-compliance-tasks"

export async function fetchUserComplianceTasks(
  userId: string,
  companyId: string
): Promise<UserComplianceTasksResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<UserComplianceTasksResponse>(
    API_ROUTES.COMPLIANCE_PROGRESS.USER_TASKS(userId, companyId),
    { headers }
  )
  return response.data
}

export async function assignControlProgress(
  controlProgressId: string,
  body: AssignControlProgressBody
): Promise<void> {
  const headers = await getAuthHeaders()

  const response = await api.post(
    API_ROUTES.COMPLIANCE_PROGRESS.ASSIGN(controlProgressId),
    body,
    { headers }
  )

  console.log(  
    "response",response.data
   )
  return response.data
}

export async function submitAssessmentForReview(body: SubmitAssessmentForReviewBody): Promise<void> {
  const headers = await getAuthHeaders()
  try {
    await api.post(API_ROUTES.COMPLIANCE_PROGRESS.SUBMIT_ASSESSMENT, body, { headers })
  } catch (e) {
    const msg =
      getApiErrorMessage(e) ?? (e instanceof Error ? e.message : "Could not send assessment for review.")
    throw new Error(msg)
  }
}
