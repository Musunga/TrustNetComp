"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAtomValue } from "jotai"
import { AlertCircle, AlertTriangle, Calendar, RefreshCw, Shield, TrendingUp, X } from "lucide-react"
import { useCompanyAssessments } from "@/hooks/use-company-assessments"
import { activeCompanyAtom } from "@/lib/store/auth"
import { cn } from "@/lib/utils"
import { formatDate, parseProgress, statusVariant } from "@/lib/constants/functions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

const FRAMEWORKS_ASSESSMENT_NOTE_DISMISSED_KEY = "compliance_dashboard_frameworks_assessment_note.dismissed.v1"
const STALE_AFTER_DAYS = 30

function daysSince(date: string | Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
}

export default function RecentActivity() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const { data: assessments, isLoading: loading, error, mutate } = useCompanyAssessments(activeCompany?.id)
  const [frameworksNoteDismissed, setFrameworksNoteDismissed] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(FRAMEWORKS_ASSESSMENT_NOTE_DISMISSED_KEY) === "1") {
        setFrameworksNoteDismissed(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  function dismissFrameworksNote() {
    setFrameworksNoteDismissed(true)
    try {
      localStorage.setItem(FRAMEWORKS_ASSESSMENT_NOTE_DISMISSED_KEY, "1")
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Your frameworks
          </CardTitle>
          <CardDescription>Frameworks your company selected and ongoing progress</CardDescription>
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
    <Card className="lg:col-span-4">
      <CardHeader className="space-y-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Your frameworks
          </CardTitle>
          <CardDescription className="mt-2">
            Frameworks your company has chosen. Open one to work through controls; when an enrollment is not started or
            in progress, you can start{" "}
            <span className="font-medium text-foreground">assisted assessment</span> for the whole framework.
          </CardDescription>
        </div>
        {!frameworksNoteDismissed ? (
          <aside className="relative border-t border-border/50 pt-3 pr-9 text-[11px] leading-normal tracking-wide text-muted-foreground/85">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1.5 size-7 text-muted-foreground hover:text-foreground"
              onClick={dismissFrameworksNote}
              aria-label="Dismiss note"
            >
              <X className="size-3.5" aria-hidden />
            </Button>
            <p className="italic">
              <span className="not-italic text-muted-foreground">Note:</span>{" "}
              Whether you progress the enrollment yourself in the dashboard or choose{" "}
              <span className="font-medium text-muted-foreground not-italic">
                assisted assessment
              </span>
              , both are subject to official approval and may involve inspection and audit. If you choose assisted
              assessment, our technical teams take it forward and physical inspection may be part of that process.
            </p>
          </aside>
        ) : null}
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive/70" />
            <div>
              <p className="text-sm font-medium">Couldn&apos;t load your frameworks</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Something went wrong on our end.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => mutate()}>
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        ) : assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <Shield className="mb-3 h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm font-medium text-muted-foreground">No frameworks yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a framework from the list on the right to add it to your company.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {assessments.map((assessment) => {
              const progress = parseProgress(assessment.progress)
              const variant = statusVariant(assessment.status)
              const isStale = progress < 100 && daysSince(assessment.updatedAt) >= STALE_AFTER_DAYS
              return (
                <li key={assessment.id} className="overflow-hidden rounded-lg border">
                  <div className="flex flex-col sm:flex-row sm:items-stretch">
                    <Link
                      href={`/dashboard/assessments/${assessment.id}`}
                      className={cn(
                        "group flex min-w-0 flex-1 flex-col gap-3 p-4 transition-colors hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
                        progress === 100 && "border-primary/20 bg-primary/5 sm:border-l-4 sm:border-l-primary"
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
                            {isStale ? (
                              <Badge
                                variant="outline"
                                className="shrink-0 gap-1 border-amber-300 text-xs text-amber-700 dark:border-amber-800 dark:text-amber-400"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                Needs attention
                              </Badge>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {assessment.year}
                            </span>
                            <span className={isStale ? "text-amber-700 dark:text-amber-400" : undefined}>
                              Updated {formatDate(assessment.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 sm:w-44">
                          <Progress value={progress} className="h-2 flex-1" />
                          <span
                            className={cn(
                              "w-10 shrink-0 text-end tabular-nums text-sm font-medium",
                              progress === 100 ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </Link>
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
