"use client"

import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import CompanySelector from "@/components/screens/CompanySelector"
import Team from "@/components/screens/Team"
import Invitation from "@/components/screens/Invitation"
import { activeCompanyAtom } from "@/lib/store/auth"
import { fetchCompanyMembersStats } from "@/lib/actions/companies"
import type { CompanyMembersStatsResponse } from "@/lib/types/company-members-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function TeamPage() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [statsData, setStatsData] = useState<CompanyMembersStatsResponse | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!activeCompany?.id) {
      setStatsData(null)
      setStatsLoading(false)
      return
    }
    setStatsLoading(true)
    fetchCompanyMembersStats(activeCompany.id)
      .then(setStatsData)
      .catch(() => setStatsData(null))
      .finally(() => setStatsLoading(false))
  }, [activeCompany?.id])

  const statsRow = (
    <div className="flex w-full max-w-[50%] flex-col md:flex-row md:items-center md:justify-between md:divide-x divide-border">
      {statsLoading || !statsData ? (
        <>
          <div className="flex-1 py-4 md:py-2 md:pr-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="mt-1 h-8 w-8" />
          </div>
          <div className="flex-1 py-4 md:py-2 md:px-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="mt-1 h-8 w-8" />
          </div>
          <div className="flex-1 py-4 md:py-2 md:px-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="mt-1 h-8 w-8" />
          </div>
          <div className="flex-1 py-4 md:py-2 md:pl-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-1 h-8 w-8" />
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 py-4 md:py-2 md:pr-6">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="mt-1 text-2xl font-bold">{statsData.stats.total}</div>
          </div>
          <div className="flex-1 py-4 md:py-2 md:px-6">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="mt-1 text-2xl font-bold">{statsData.stats.active}</div>
          </div>
          <div className="flex-1 py-4 md:py-2 md:px-6">
            <div className="text-sm text-muted-foreground">Invited</div>
            <div className="mt-1 text-2xl font-bold">{statsData.stats.invited}</div>
          </div>
          <div className="flex-1 py-4 md:py-2 md:pl-6">
            <div className="text-sm text-muted-foreground">Suspended</div>
            <div className="mt-1 text-2xl font-bold">{statsData.stats.suspended}</div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
            <p className="text-muted-foreground">Invite and manage members of your company compliance team.</p>
          </div>
          <div className="flex items-center gap-2">
            <CompanySelector />
          </div>
        </div>

        {statsRow}

        <div className="grid gap-8 md:grid-cols-4">
          <Team />
          <Invitation />
        </div>
      </div>
    </DashboardShell>
  )
}
