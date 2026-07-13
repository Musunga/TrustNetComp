"use client"

import Link from "next/link"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { activeCompanyAtom, authSessionAtom } from "@/lib/store/auth"
import { fetchUserComplianceTasks } from "@/lib/actions/compliance-progress"
import { Skeleton } from "@/components/ui/skeleton"

export default function PendingTasksSummary() {
  const authSession = useAtomValue(authSessionAtom)
  const activeCompany = useAtomValue(activeCompanyAtom)
  const userId = authSession?.user?.id
  const companyId = activeCompany?.id
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !companyId) {
      setPendingCount(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchUserComplianceTasks(userId, companyId)
      .then((data) => {
        const pending = data.tasks.filter((t) => t.completionPercentage < 100).length
        setPendingCount(pending)
      })
      .catch(() => setPendingCount(null))
      .finally(() => setLoading(false))
  }, [userId, companyId])

  if (loading) {
    return (
      <div className="flex-1 py-4 md:py-2 md:px-6">
        <div className="text-sm text-muted-foreground">Pending Tasks</div>
        <Skeleton className="mt-1 h-8 w-16" />
        <Skeleton className="mt-1 h-3 w-32" />
      </div>
    )
  }

  return (
    <Link
      href="/dashboard/tasks"
      className="block flex-1 rounded-md py-4 md:py-2 md:px-6 hover:bg-accent/5"
    >
      <div className="text-sm text-muted-foreground">Pending Tasks</div>
      <div className="mt-1 text-2xl font-bold">{pendingCount ?? "—"}</div>
      <p className="text-xs text-muted-foreground">
        {pendingCount === null ? "No data" : "Assigned to you"}
      </p>
    </Link>
  )
}
