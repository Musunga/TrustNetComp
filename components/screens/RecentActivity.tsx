"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useAtomValue } from "jotai"
import { Calendar, Shield, ClipboardCheck, TrendingUp } from "lucide-react"
import { fetchCompanyAssessments } from "@/lib/actions/frameworks"
import { requestAssistedAssessment } from "@/lib/actions/assisted-assessments"
import type { Assessment } from "@/lib/types"
import { activeCompanyAtom } from "@/lib/store/auth"
import { cn } from "@/lib/utils"
import {
  formatDate,
  parseProgress,
  resolveCompanyFrameworkEnrollmentId,
  statusVariant,
} from "@/lib/constants/functions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecentActivity() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [assistedDialog, setAssistedDialog] = useState<Assessment | null>(null)
  const [assistedSubmitting, setAssistedSubmitting] = useState(false)

  function reloadAssessments() {
    if (!activeCompany?.id) return
    fetchCompanyAssessments(activeCompany.id).then(setAssessments).catch(() => setAssessments([]))
  }

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

  async function submitAssistedRequest() {
    if (!activeCompany?.id || !assistedDialog) return
    setAssistedSubmitting(true)
    try {
      await requestAssistedAssessment({
        companyId: activeCompany.id,
        companyFrameworkId: resolveCompanyFrameworkEnrollmentId(assistedDialog),
      })
      toast.success("Assisted assessment submitted", {
        description: `We recorded assisted assessment for ${assistedDialog.framework.name}.`,
      })
      setAssistedDialog(null)
      reloadAssessments()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong."
      toast.error("Submission failed", { description: message })
    } finally {
      setAssistedSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="col-span-4">
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
    <>
      <Card className="col-span-4">
        <CardHeader className="space-y-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Your frameworks
            </CardTitle>
            <CardDescription className="mt-2">
              Frameworks your company has chosen. Open one to work through controls internally, or start{" "}
              <span className="font-medium text-foreground">assisted assessment</span> for the whole framework.
            </CardDescription>
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Assisted assessments</span> apply to the entire framework
            enrollment (not individual tasks). You can still keep working inside the assessment on your side.
          </div>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
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
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {assessment.year}
                              </span>
                              <span>Updated {formatDate(assessment.updatedAt)}</span>
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
                      <div className="flex items-center justify-center border-t bg-muted/20 p-3 sm:w-56 sm:shrink-0 sm:border-t-0 sm:border-l sm:bg-muted/30 sm:px-4">
                        <Button
                          type="button"
                          variant="default"
                          size="default"
                          className="w-full gap-2 shadow-sm"
                          disabled={!activeCompany?.id}
                          onClick={() => setAssistedDialog(assessment)}
                        >
                          <ClipboardCheck className="h-4 w-4 shrink-0" aria-hidden />
                          Assisted assessment
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!assistedDialog} onOpenChange={(open) => !open && setAssistedDialog(null)}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Assisted assessment?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-left text-sm text-muted-foreground">
                <p>
                  This starts{" "}
                  <span className="font-medium text-foreground">framework-wide assisted assessment</span> for{" "}
                  <span className="font-medium text-foreground">{assistedDialog?.framework.name}</span> (
                  {assistedDialog?.year}). It covers the enrollment as a whole, not individual controls, and TrustNet will
                  follow up according to scheduling and agreements.
                </p>
                <p>
                  You can still open the assessment anytime to work internally with your team — those actions stay
                  available in parallel.
                </p>
                <p className="text-xs">
                  This submission uses your company–framework enrollment id from this list (see API field{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">companyFrameworkId</code>
                  ). If the enrollment id is returned separately on the assessment payload, that value is used;
                  otherwise this row&apos;s id is sent.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={assistedSubmitting}>Cancel</AlertDialogCancel>
            <Button type="button" disabled={assistedSubmitting} onClick={submitAssistedRequest}>
              {assistedSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
