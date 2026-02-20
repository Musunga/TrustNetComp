"use client"

import { fetchCompanyAssessments } from "@/lib/actions/frameworks"
import { activeCompanyAtom } from "@/lib/store/auth"
import type { Assessment } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { Shield, TrendingUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Separator } from "../ui/separator"
import { formatDate, parseProgress, statusVariant } from "@/lib/constants/functions"


export default function RecentActivity() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const activeCompany = useAtomValue(activeCompanyAtom)

  useEffect(() => {
    if (!activeCompany?.id) {
      setAssessments([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetchCompanyAssessments(activeCompany.id)
      .then((data) => setAssessments(data))
      .catch(() => setAssessments([]))
      .finally(() => setLoading(false))
  }, [activeCompany?.id])

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest assessments and progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
        <CardDescription>Assessment progress and status by framework</CardDescription>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <Shield className="mb-3 h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm font-medium text-muted-foreground">No assessments yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Assessments for this company will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {assessments.map((assessment) => {
              const progress = parseProgress(assessment.progress)
              const variant = statusVariant(assessment.status)
              return (
                <li key={assessment.id}>
                  <Link
                    href={`/dashboard/assessments/${assessment.id}`}
                    className={cn(
                      "group block  p-4 transition-colors hover:bg-muted/30  focus-visible:ring-2 focus-visible:ring-ring/30",
                      progress === 100 && "border-primary/20 bg-primary/5"
                    )}
                    aria-label={`Open assessment ${assessment.framework.name}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium leading-tight group-hover:underline">
                            {assessment.framework.name}
                          </span>
                          <Badge variant={variant} className="shrink-0 text-xs">
                            {assessment.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {assessment.year}
                          </span>
                          <span>Updated {formatDate(assessment.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 sm:w-40">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span
                          className={cn(
                            "tabular-nums font-medium",
                            progress === 100 ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {progress}%
                        </span>
                      </div>
                   
                    </div>
                    <Separator className="my-2 " />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
