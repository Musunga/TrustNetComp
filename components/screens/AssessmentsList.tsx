"use client"

import Link from "next/link"
import { fetchCompanyAssessments } from "@/lib/actions/frameworks"
import { activeCompanyAtom } from "@/lib/store/auth"
import type { Assessment } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Progress } from "@radix-ui/react-progress"
import { useAtomValue } from "jotai"
import { Shield, Calendar, FileText } from "lucide-react"
import { Badge } from "../ui/badge"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { formatDate, parseProgress, statusVariant, resolveCompanyFrameworkEnrollmentId } from "@/lib/constants/functions"

const badgeVariants = ["default", "destructive", "outline", "secondary", "warning", "success"] as const
type BadgeVariant = (typeof badgeVariants)[number]

const getBadgeVariant = (value: string): BadgeVariant =>
  badgeVariants.includes(value as BadgeVariant) ? (value as BadgeVariant) : "secondary"

const AssessmentsList = () => {
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
            List of all your assessments
          </CardTitle>
          <CardDescription>Assessment progress and status by framework</CardDescription>
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
          List of all your assessments
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
              const enrollmentId = resolveCompanyFrameworkEnrollmentId(assessment)
              return (
                <li key={assessment.id}>
                  <div
                    className={cn(
                      "group rounded-lg p-4 transition-colors hover:bg-muted/30 focus-within:ring-2 focus-within:ring-ring/30",
                      progress === 100 && "border border-primary/20 bg-primary/5"
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        href={`/dashboard/assessments/${enrollmentId}`}
                        className="min-w-0 flex-1 space-y-1"
                        aria-label={`Open assessment ${assessment.framework.name}`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium leading-tight group-hover:underline">
                            {assessment.framework.name}
                          </span>
                          <Badge variant={variant} className="shrink-0 text-xs">
                            {assessment.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {assessment.year}
                          </span>
                          <span>Updated {formatDate(assessment.updatedAt)}</span>
                        </div>
                      </Link>
                      <div className="flex shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3 sm:w-40">
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
                        <Button variant="outline" size="sm" className="w-full shrink-0 gap-2 sm:w-auto" asChild>
                          <Link href={`/dashboard/assessments/${enrollmentId}/report`}>
                            <FileText className="h-4 w-4" aria-hidden />
                            View report
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-2 " />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default AssessmentsList
