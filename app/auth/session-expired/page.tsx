"use client"

import { useEffect } from "react"

const CLEAR_SESSION_URL = "/api/auth/clear-session?redirect=/login"

export default function SessionExpiredPage() {
  useEffect(() => {
    window.location.href = CLEAR_SESSION_URL
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Redirecting to login…</p>
    </div>
  )
}
