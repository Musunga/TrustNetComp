"use client"

import Link from "next/link"
import { useAtomValue } from "jotai"
import { AlertCircle, CheckSquare, RefreshCw } from "lucide-react"
import { activeCompanyAtom, authSessionAtom } from "@/lib/store/auth"
import { useUserComplianceTasks } from "@/hooks/use-user-compliance-tasks"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PendingTasksSummary() {
  const authSession = useAtomValue(authSessionAtom)
  const activeCompany = useAtomValue(activeCompanyAtom)
  const userId = authSession?.user?.id
  const companyId = activeCompany?.id
  const { data, isLoading: loading, error, mutate } = useUserComplianceTasks(userId, companyId)
  const pendingCount = data ? data.tasks.filter((t) => t.completionPercentage < 100).length : null

  return (
    <Card>
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <CheckSquare className="h-5 w-5 text-primary" />
        </div>

        {loading ? (
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-14" />
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                Couldn&apos;t load
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => mutate()}
              aria-label="Retry loading pending tasks"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : !companyId ? (
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
            <p className="mt-1 text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">Select a company</p>
          </div>
        ) : (
          <Link href="/dashboard/tasks" className="flex-1 rounded-md">
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
            <p className="mt-0.5 text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">
              {pendingCount === 0 ? "All caught up" : "Assigned to you"}
            </p>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
