"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import FrameworksList from "@/components/screens/FrameworksList"
import RecentActivity from "@/components/screens/RecentActivity"
import CompanySelector from "@/components/screens/CompanySelector"
import MemberBreakdown from "@/components/screens/MemberBreakdown"
import PendingTasksSummary from "@/components/screens/PendingTasksSummary"
import TechnicalAdminDashboard from "@/components/screens/TechnicalAdminDashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { authSessionAtom } from "@/lib/store/auth"
import { authSessionIsTechnicalAdmin } from "@/lib/constants/functions"
import { useAtomValue } from "jotai"

function DashboardHydrationSkeleton() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-[min(100%,36rem)]" />
        </div>
        <Skeleton className="h-9 w-44 shrink-0" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-7">
        <Skeleton className="h-88 rounded-xl lg:col-span-5" />
        <Skeleton className="h-88 rounded-xl lg:col-span-2" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const authSession = useAtomValue(authSessionAtom)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isTechnicalAdmin = authSessionIsTechnicalAdmin(authSession)

  return (
    <DashboardShell>
      {!mounted ? (
        <DashboardHydrationSkeleton />
      ) : isTechnicalAdmin ? (
        <TechnicalAdminDashboard />
      ) : (
        <CompanyAdminDashboard />
      )}
    </DashboardShell>
  )
}

function CompanyAdminDashboard() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Admin. Here is your company's compliance overview.</p>
        </div>
        <CompanySelector />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:divide-x divide-border">
        <MemberBreakdown />
        <PendingTasksSummary />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity />
        <FrameworksList />
      </div>
    </div>
  )
}
