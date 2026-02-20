"use client"

import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { activeCompanyAtom } from "@/lib/store/auth"
import { fetchCompanyMembersStats } from "@/lib/actions/companies"
import type { CompanyMembersStatsResponse } from "@/lib/types/company-members-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function MemberBreakdown() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [data, setData] = useState<CompanyMembersStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeCompany?.id) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchCompanyMembersStats(activeCompany.id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [activeCompany?.id])

  if (loading) {
    return (
      <div className="flex-1 py-4 md:py-2 md:px-6">
        <div className="text-sm text-muted-foreground">Team Members</div>
        <Skeleton className="mt-1 h-8 w-16" />
        <Skeleton className="mt-1 h-3 w-32" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 py-4 md:py-2 md:px-6">
        <div className="text-sm text-muted-foreground">Team Members</div>
        <div className="mt-1 text-2xl font-bold">—</div>
        <p className="text-xs text-muted-foreground">No data</p>
      </div>
    )
  }

  const { stats } = data
  const breakdown = [
    { label: "active", value: stats.active },
    { label: "invited", value: stats.invited },
    { label: "suspended", value: stats.suspended },
  ]
    .filter((x) => x.value > 0)
    .map((x) => `${x.value} ${x.label}`)
    .join(" · ") || "—"

  return (
    <div className="flex-1 py-4 md:py-2 md:px-6">
      <div className="text-sm text-muted-foreground">Team Members</div>
      <div className="mt-1 text-2xl font-bold">{stats.total}</div>
      <p className="text-xs text-muted-foreground">{breakdown}</p>
    </div>
  )
}
