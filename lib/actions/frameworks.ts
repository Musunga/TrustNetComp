"use server"

import api from "../api"
import { getAuthHeaders } from "../auth-headers"
import { API_ROUTES } from "../constants/api-routes"
import type { AssessmentDetail } from "../types/assessment-detail"
import type { AssessmentReportData } from "../types/assessment-report-data"
import type { ComplianceProgressPatchBody } from "../types/compliance-progress"
import type {
  Assessment,
  Framework,
  FrameworkCompanyResponse,
  FrameworkResponse,
  FrameworkSelectBody,
} from "../types/framework"
import type { FrameworkPreviewResponse } from "../types/framework-preview"
import { normalizeAssessmentDetailResponse } from "../utils/assessment-detail-response"



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
  const response = await api.get<unknown>(API_ROUTES.FRAMEWORKS.GET(assessmentId), {
    headers,
  })
  const normalized = normalizeAssessmentDetailResponse(response.data)
  return normalized ?? (response.data as AssessmentDetail)
}

export async function fetchAssessmentReportData(assessmentId: string): Promise<AssessmentReportData> {
  const headers = await getAuthHeaders()
  const response = await api.get<AssessmentReportData>(API_ROUTES.ASSESSMENTS.REPORT_DATA(assessmentId), {
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
