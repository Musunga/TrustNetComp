"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_SESSION_STORAGE_KEY,
  ACTIVE_COMPANY_STORAGE_KEY,
} from "@/lib/constants/variables"

export function ClearSessionOnLogin() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("session_expired") !== "1") return
    localStorage.removeItem(ACCESS_TOKEN_COOKIE_NAME)
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY)
    router.replace("/login", { scroll: false })
  }, [searchParams, router])

  return null
}
