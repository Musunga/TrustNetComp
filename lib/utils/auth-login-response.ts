import type { AuthSessionI, LoginResponseI } from "@/lib/types/auth"

/** Persisted UI session from POST /auth/login (or equivalent) — tolerate omitted fields returned by newer API versions. */
export function authSessionFromLogin(data: LoginResponseI): AuthSessionI {
  return {
    user: data.user,
    memberships: Array.isArray(data.memberships) ? data.memberships : [],
    activeMembership: data.activeMembership ?? null,
    selectedCompanyId: data.selectedCompanyId ?? null,
    requiresCompanySelection: Boolean(data.requiresCompanySelection),
    message: typeof data.message === "string" ? data.message : "",
  }
}
