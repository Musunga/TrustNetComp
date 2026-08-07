"use client"

import Link from "next/link"
import { useAtomValue } from "jotai"
import { AlertCircle, RefreshCw, Users } from "lucide-react"
import { activeCompanyAtom } from "@/lib/store/auth"
import { useCompanyMembersStats } from "@/hooks/use-company-members-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MemberBreakdown() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const { data, isLoading: loading, error, mutate } = useCompanyMembersStats(activeCompany?.id)

  return (
    <Card>
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>

        {loading ? (
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-14" />
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
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
              aria-label="Retry loading team members"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : !activeCompany?.id ? (
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Team Members</p>
            <p className="mt-1 text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">Select a company</p>
          </div>
        ) : (
          <Link href="/dashboard/team" className="flex-1 rounded-md">
            <p className="text-sm text-muted-foreground">Team Members</p>
            <p className="mt-0.5 text-2xl font-bold">{data?.stats.total ?? 0}</p>
            <p className="text-xs text-muted-foreground">
              {[
                { label: "active", value: data?.stats.active ?? 0 },
                { label: "invited", value: data?.stats.invited ?? 0 },
                { label: "suspended", value: data?.stats.suspended ?? 0 },
              ]
                .filter((x) => x.value > 0)
                .map((x) => `${x.value} ${x.label}`)
                .join(" · ") || "No members yet"}
            </p>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
