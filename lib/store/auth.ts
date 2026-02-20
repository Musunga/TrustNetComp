import { atomWithStorage } from "jotai/utils"
import type { AuthSessionI, CompanyI } from "@/lib/types/auth"
import { AUTH_SESSION_STORAGE_KEY, ACTIVE_COMPANY_STORAGE_KEY } from "@/lib/constants/variables"

export const authSessionAtom = atomWithStorage<AuthSessionI | null>(
  AUTH_SESSION_STORAGE_KEY,
  null
)

export const activeCompanyAtom = atomWithStorage<CompanyI | null>(
  ACTIVE_COMPANY_STORAGE_KEY,
  null
)
