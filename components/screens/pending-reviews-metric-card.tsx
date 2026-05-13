"use client"

import type { LucideIcon } from "lucide-react"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PENDING_TECHNICAL_REVIEWS_DESCRIPTION,
  PENDING_TECHNICAL_REVIEWS_TITLE,
} from "@/lib/constants/technical-admin"

export function PendingReviewsMetricCard({
  pendingCount,
  Icon = Search,
}: {
  pendingCount: number | null
  Icon?: LucideIcon
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{PENDING_TECHNICAL_REVIEWS_TITLE}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {pendingCount === null ? "—" : pendingCount}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{PENDING_TECHNICAL_REVIEWS_DESCRIPTION}</p>
      </CardContent>
    </Card>
  )
}
