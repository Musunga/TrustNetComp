"use server"

import api, { getAuthHeaders, getApiErrorMessage } from "../api"
import { API_ROUTES } from "../constants/api-routes"
import type { UserRolesResponse } from "../types/user-roles"
import type {
  CreateInvitationBody,
  DeleteInvitationBody,
  ResendInvitationBody,
  AcceptInvitationBody,
} from "../types/invitation"
import type { CompanyInvitationsResponse } from "../types/company-invitations"

export async function fetchUserRoles(): Promise<UserRolesResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<UserRolesResponse>(
    API_ROUTES.USER_ROLES.ROLES,
    { headers }
  )
  return response.data
}

export async function createInvitation(
  body: CreateInvitationBody
): Promise<void> {
  const headers = await getAuthHeaders()
  await api.post(API_ROUTES.INVITATIONS.CREATE, body, { headers })
}

export async function fetchCompanyInvitations(
  companyId: string
): Promise<CompanyInvitationsResponse> {
  const headers = await getAuthHeaders()
  const response = await api.get<CompanyInvitationsResponse>(
    API_ROUTES.INVITATIONS.BY_COMPANY(companyId),
    { headers }
  )
  return response.data
}

export async function deleteInvitation(
  invitationId: string,
  body: DeleteInvitationBody
): Promise<void> {
  const headers = await getAuthHeaders()
  await api.delete(API_ROUTES.INVITATIONS.DELETE(invitationId), {
    data: body,
    headers,
  })
}

export async function resendInvitation(
  invitationId: string,
  body: ResendInvitationBody
): Promise<void> {
  const headers = await getAuthHeaders()
  await api.post(API_ROUTES.INVITATIONS.RESEND(invitationId), body, { headers })
}

export async function acceptInvitation(
  body: AcceptInvitationBody
): Promise<void> {
  try {
    await api.post(API_ROUTES.INVITATIONS.ACCEPT, body)
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message ?? "Failed to accept invitation.")
  }
}
