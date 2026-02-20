"use client"

import React, { useEffect, useState } from "react"
import { fetchAssessmentDetails, patchComplianceProgress } from "@/lib/actions/frameworks"
import type {
  AssessmentDetail,
  AssessmentControl,
  AssessmentFunction,
} from "@/lib/types/assessment-detail"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, AlertCircle, RefreshCw, ClipboardList, Calendar, ChevronDown } from "lucide-react"
import { useViewOrchestrator } from "@/hooks/use-pageView"
import { ViewDefinition, ViewOrchestrator } from "../shared/Pageview"
import { ControlFunctionsList } from "./ControlFunctionsList"
import { ArrowLeft } from "lucide-react"


function parseProgress(value: string): number {
  const num = parseInt(String(value).replace(/%/g, "").trim(), 10)
  return Number.isNaN(num) ? 0 : Math.min(100, Math.max(0, num))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function statusVariant(code: string): "default" | "secondary" | "destructive" | "success" | "outline" {
  const c = (code ?? "").toUpperCase().replace(/-/g, "_")
  if (c === "COMPLIANT" || c === "FULLY_COMPLIANT") return "success"
  if (c === "PARTIAL" || c === "IN_PROGRESS") return "secondary"
  if (c === "NOT_COMPLIANT" || c === "NON_COMPLIANT") return "destructive"
  return "outline"
}

const COMPLIANCE_OPTIONS = [
  { value: "COMPLIANT", label: "Compliant" },
  { value: "NOT_COMPLIANT", label: "Non-compliant" },
] as const

function ControlStatusModal({
  control,
  open,
  onOpenChange,
  onSave,
}: {
  control: AssessmentControl | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (payload: {
    statusCode: string
    assignedToComment: string
    attachedEvidence: string[]
  }) => Promise<void>
}) {
  const [status, setStatus] = React.useState<string>("")
  const [assignedToComment, setAssignedToComment] = React.useState<string>("")
  const [files, setFiles] = React.useState<File[]>([])
  const [saving, setSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open && control) {
      setStatus(control.progress?.status?.code ?? "")
      setAssignedToComment(control.progress?.assignedToComment ?? "")
      setFiles([])
      setSaveError(null)
    }
  }, [open, control])

  async function handleSave() {
    if (!status) return
    setSaveError(null)
    setSaving(true)
    try {
      await onSave?.({
        statusCode: status,
        assignedToComment: assignedToComment.trim(),
        attachedEvidence: [],
      })
      onOpenChange(false)
    } catch {
      setSaveError("Failed to update. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update control status</DialogTitle>
          {control ? (
            <DialogDescription asChild>
              <div className="space-y-2">
                <span className="font-mono text-xs">{control.code}</span>
                <p className="whitespace-normal wrap-break-word text-sm text-muted-foreground">
                  {control.question}
                </p>
                {control.requiredEvidence?.length > 0 ? (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Required documents:</span>
                    <ul className="mt-1 list-inside list-disc space-y-0.5">
                      {control.requiredEvidence.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Compliance status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {COMPLIANCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="e.g. All controls have been implemented and documented."
              value={assignedToComment}
              onChange={(e) => setAssignedToComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label>Upload images (optional)</Label>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 p-6">
              <input
                type="file"
                accept="image/*"
                multiple
                className="text-muted-foreground w-full max-w-xs text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground file:hover:bg-primary/90"
                onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
              />
              {files.length > 0 && (
                <p className="text-xs text-muted-foreground">{files.length} file(s) selected</p>
              )}
            </div>
          </div>
          {saveError && (
            <p className="text-sm text-destructive">{saveError}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !status}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FunctionSection({
  fn,
  onOpenActionModal,
}: {
  fn: AssessmentFunction
  onOpenActionModal?: (control: AssessmentControl) => void
}) {
  const areas = fn.controlAreas ?? []
  const hasControls = areas.some((a) => (a.controls?.length ?? 0) > 0)

  if (!hasControls) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">No controls in this function.</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 w-24 py-2 text-xs font-medium text-muted-foreground">Code</TableHead>
            <TableHead className="h-8 min-w-[280px] py-2 text-xs font-medium text-muted-foreground">
              Question
            </TableHead>
            <TableHead className="h-8 w-28 py-2 text-xs font-medium text-muted-foreground">Status</TableHead>
            <TableHead className="h-8 w-20 py-2 text-right text-xs font-medium text-muted-foreground">
              %
            </TableHead>
            <TableHead className="h-8 w-[1%] py-2 text-right text-xs font-medium text-muted-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map((area) => (
            <React.Fragment key={area.id}>
              <TableRow className="hover:bg-transparent bg-muted/40">
                <TableCell colSpan={5} className="py-2 font-medium text-foreground">
                  <span className="font-bold">{area.name}</span>
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                    {area.code}
                  </span>
                </TableCell>
              </TableRow>
              {(area.controls ?? []).map((control) => {
                const statusCode = control.progress?.status?.code ?? ""
                const statusName = (control.progress?.status?.name ?? statusCode) || "—"
                const completion = control.progress?.completionPercentage ?? 0
                return (
                  <TableRow key={control.id}>
                    <TableCell className="py-2 font-mono text-xs text-muted-foreground">
                      {control.code}
                    </TableCell>
                    <TableCell className="min-w-[280px] max-w-[50%] py-2 text-sm">
                      <span className="whitespace-normal wrap-break-word">
                        {control.question}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant={statusVariant(statusCode)} className="text-xs">
                        {statusName}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-xs tabular-nums text-muted-foreground">
                      {completion}%
                    </TableCell>
                    <TableCell className="py-2 pr-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => onOpenActionModal?.(control)}
                      >
                        Action
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
export type PageViews = "controlFunctions" | "functionDetail"

export default function AssessmentDetails({ id }: { id: string }) {
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFunction, setSelectedFunction] = useState<AssessmentFunction | null>(null)
  const [actionModalControl, setActionModalControl] = useState<AssessmentControl | null>(null)
  const [frameworkCardOpen, setFrameworkCardOpen] = useState(true)

  const { activeViewId, navigateTo, navigateBack, direction } =
    useViewOrchestrator<PageViews>("controlFunctions")


  function load() {
    setError(null)
    setLoading(true)
    return fetchAssessmentDetails(id)
      .then((data) => {
        setAssessment(data)
        return data
      })
      .catch(() => setError("Failed to load assessment. Please try again."))
      .finally(() => setLoading(false))
  }

  async function refetchAssessment() {
    const data = await fetchAssessmentDetails(id).catch(() => null)
    if (data) setAssessment(data)
    return data
  }

  useEffect(() => {
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
            <Skeleton className="h-4 max-w-2xl" />
            <div className="flex flex-wrap gap-4 pt-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          </CardContent>
        </Card>
        <div>
          <Skeleton className="mb-4 h-6 w-56" />
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-center text-sm text-muted-foreground">{error ?? "Assessment not found."}</p>
          <Button variant="outline" onClick={load} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const overallProgress = parseProgress(assessment.progress)
  const totalControls = assessment.functions?.reduce(
    (sum, fn) => sum + (fn.controlAreas?.reduce((s, ca) => s + (ca.controls?.length ?? 0), 0) ?? 0),
    0
  ) ?? 0

  const views: ViewDefinition<PageViews>[] = [
    {
      id: "controlFunctions",
      content: (
        <ControlFunctionsList
          functions={assessment.functions ?? []}
          onSelectFunction={(fn) => {
            setSelectedFunction(fn)
            navigateTo("functionDetail")
          }}
        />
      ),
    },
    {
      id: "functionDetail",
      content: selectedFunction ? (
        <div className="flex flex-col gap-4 p-4">
          <div className="sticky top-0 z-10 flex shrink-0 flex-col gap-2 border-b bg-background pb-2 pt-1 -mt-1">
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-2 font-bold"
              onClick={navigateBack}
              aria-label="Back to functions"
            >
              <ArrowLeft className="h-4 w-4 " />
              Back to functions
            </Button>
            {selectedFunction.description && (
              <p className="font-bold text-xl text-muted-foreground">{selectedFunction.name} <span className="text-muted-foreground text-sm"></span></p>
            )}
          </div>
          <FunctionSection
            fn={selectedFunction}
            onOpenActionModal={setActionModalControl}
          />
          <ControlStatusModal
            control={actionModalControl}
            open={!!actionModalControl}
            onOpenChange={(open) => !open && setActionModalControl(null)}
            onSave={async (payload) => {
              if (!actionModalControl || !assessment) return
              await patchComplianceProgress(actionModalControl.progress.id, {
                companyId: assessment.companyId,
                statusCode: payload.statusCode,
                assignedToComment: payload.assignedToComment,
                attachedEvidence: payload.attachedEvidence,
              })
              setActionModalControl(null)
              const data = await refetchAssessment()
              if (data?.functions && selectedFunction) {
                const updated = data.functions.find(
                  (f) => f.id === selectedFunction.id
                )
                if (updated) setSelectedFunction(updated)
              }
            }}
          />
        </div>
      ) : (
        <div className="p-4 text-sm text-muted-foreground">No function selected.</div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Collapsible open={frameworkCardOpen} onOpenChange={setFrameworkCardOpen}>
        <Card>
          <CardHeader className="py-0">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              >
                <Shield className="h-4 w-4 shrink-0 text-primary" />
                <CardTitle className="text-base font-semibold">
                  {assessment.framework.name}
                  <span className="ml-1 font-normal text-muted-foreground">
                    ({assessment.framework.code})
                  </span>
                </CardTitle>
                <Badge variant={statusVariant(assessment.status)} className="text-xs">
                  {assessment.status.replace(/_/g, " ")}
                </Badge>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Year {assessment.year}
                  </span>
                  {assessment.dueDate && <span>Due {formatDate(assessment.dueDate)}</span>}
                  <span>Updated {formatDate(assessment.updatedAt)}</span>
                </span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${frameworkCardOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-2 pt-0">
              {assessment.framework.description && (
                <CardDescription className="text-xs">{assessment.framework.description}</CardDescription>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall progress</span>
                  <span className="font-medium tabular-nums">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          Controls by function        {totalControls > 0 && (
              <span className="text-muted-foreground">({totalControls})</span>
            )}
        </h2>
        <ScrollArea className="h-[calc(100vh-20rem)] rounded-lg border bg-muted/20">
          <ViewOrchestrator
            views={views}
            activeViewId={activeViewId}
            direction={direction}
          />
        </ScrollArea>
      </div>
    </div>
  )
}
