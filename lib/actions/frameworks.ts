"use server"

import api, { getAuthHeaders } from "../api"
import { API_ROUTES } from "../constants/api-routes"
import type { AssessmentDetail } from "../types/assessment-detail"
import type { ComplianceProgressPatchBody } from "../types/compliance-progress"
import type {
  Assessment,
  Framework,
  FrameworkCompanyResponse,
  FrameworkResponse,
  FrameworkSelectBody,
} from "../types/framework"
import type { FrameworkPreviewResponse } from "../types/framework-preview"



export const fetchAllFrameworks = async (): Promise<Framework[]> => {
  const headers = await getAuthHeaders();
  const response = await api.get<FrameworkResponse>(API_ROUTES.FRAMEWORKS.LIST, {
    headers,
  });
  return response.data.frameworks;
}

export const fetchCompanyAssessments = async (companyId: string): Promise<Assessment[]> => {
  const headers = await getAuthHeaders();
  const response = await api.get<FrameworkCompanyResponse>(
    API_ROUTES.FRAMEWORKS.GET_COMPANY(companyId),
    { headers }
  );
  return response.data.frameworks;
}

export const fetchAssessmentDetails = async (assessmentId: string): Promise<AssessmentDetail> => {
  const headers = await getAuthHeaders()
  const response = await api.get<AssessmentDetail>(API_ROUTES.FRAMEWORKS.GET(assessmentId), {
    headers,
  })
  return response.data
}

export async function patchComplianceProgress(
  controlProgressId: string,
  body: ComplianceProgressPatchBody
): Promise<void> {
  const headers = await getAuthHeaders()
  await api.patch(API_ROUTES.COMPLIANCE_PROGRESS.PATCH(controlProgressId), body, {
    headers,
  })
}

export async function selectFramework(
  body: FrameworkSelectBody
): Promise<void> {
  const headers = await getAuthHeaders()
  await api.post(API_ROUTES.FRAMEWORKS.SELECT, body, { headers })
}

export async function fetchFrameworkPreview(
  frameworkId: string | number
): Promise<FrameworkPreviewResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<FrameworkPreviewResponse>(
    API_ROUTES.FRAMEWORKS.PREVIEW(frameworkId),
    { headers }
  )
  return response.data
}