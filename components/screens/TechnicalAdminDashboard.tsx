"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import { Award, CheckCircle2, FileText } from "lucide-react"
import { AssistedAssessmentReviewQueueTable } from "@/components/screens/assisted-assessment-review-queue-table"
import { PendingReviewsMetricCard } from "@/components/screens/pending-reviews-metric-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TechnicalAdminMetric } from "@/lib/types/technical-admin-dashboard"

export default function TechnicalAdminDashboard() {
  const [pendingReviews, setPendingReviews] = useState<number | null>(null)

  const onPendingTotalChange = useCallback((totalItems: number | null) => {
    setPendingReviews(totalItems)
  }, [])

  const otherMetrics: TechnicalAdminMetric[] = [
    {
      title: "Reports generated",
      value: "128",
      description: "Compliance reports created by the review team",
    },
    {
      title: "Certificates issued",
      value: "42",
      description: "Certificates released after payment confirmation",
    },
  ]

  const otherIcons = [FileText, Award] as const

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3">
            Technical Admin
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">Technical Review Dashboard</h2>
          <p className="text-muted-foreground">
            Review submitted compliance modules, generate reports, and release certificates.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/technical-review">Open review portal</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PendingReviewsMetricCard pendingCount={pendingReviews} />
        {otherMetrics.map((metric, index) => {
          const Icon = otherIcons[index]
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums">{metric.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Review queue</CardTitle>
            <CardDescription>
              Assessments that need technical admin action. Use Details to open the same framework assessment view as company admins (controls, progress, and evidence).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssistedAssessmentReviewQueueTable onPendingTotalChange={onPendingTotalChange} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Next actions</CardTitle>
            <CardDescription>Common technical admin workflows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Validate submitted evidence",
              "Generate compliance reports",
              "Confirm payment before certificates",
            ].map((action) => (
              <div key={action} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <p className="text-sm">{action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
