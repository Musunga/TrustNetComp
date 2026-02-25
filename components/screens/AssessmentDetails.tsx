"use client"

import React, { useEffect, useState } from "react"
import { assignControlProgress } from "@/lib/actions/compliance-progress"
import { fetchCompanyMembers } from "@/lib/actions/companies"
import { fetchAssessmentDetails, patchComplianceProgress } from "@/lib/actions/frameworks"
import type {
  AssessmentDetail,
  AssessmentControl,
  AssessmentFunction,
} from "@/lib/types/assessment-detail"
import type { CompanyMember } from "@/lib/types/company-members"
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
import { ControlStatusSheet } from "@/components/shared/ControlStatusSheet"
import { FileUpload } from "@/components/shared/FileUpload"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, AlertCircle, RefreshCw, ClipboardList, Calendar, ChevronDown, UserPlus, PenLine, Upload, Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { complianceStatusVariant } from "@/lib/constants/functions"
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

function isCompliant(statusCode: string): boolean {
  const c = (statusCode ?? "").toUpperCase().replace(/-/g, "_")
  return c === "COMPLIANT" || c === "FULLY_COMPLIANT"
}

type AssignedToRaw = string | null | { id?: string; user?: { name?: string; firstName?: string; lastName?: string; email?: string } }

function getAssignedToId(raw: AssignedToRaw): string | null {
  if (raw == null) return null
  if (typeof raw === "string") return raw
  if (typeof raw === "object" && typeof raw.id === "string") return raw.id
  return null
}

function getAssignedToUserFromRaw(raw: AssignedToRaw): { name: string; email?: string } | null {
  if (raw == null || typeof raw !== "object" || !raw.user || typeof raw.user !== "object") return null
  const u = raw.user
  const name =
    typeof u.name === "string" && u.name.trim()
      ? u.name.trim()
      : [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || "—"
  return { name, email: typeof u.email === "string" ? u.email : undefined }
}

function FunctionSection({
  fn,
  onOpenActionModal,
  onAssign,
  onUploadEvidence,
  onViewAssignee,
}: {
  fn: AssessmentFunction
  onOpenActionModal?: (control: AssessmentControl) => void
  onAssign?: (control: AssessmentControl) => void
  onUploadEvidence?: (control: AssessmentControl) => void
  onViewAssignee?: (control: AssessmentControl) => void
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
                const compliant = isCompliant(statusCode)
                const isAssigned = !!control.progress?.assignedTo
                const assigneeUser = getAssignedToUserFromRaw(control.progress?.assignedTo as AssignedToRaw)
                return (
                  <TableRow key={control.id}>
                    <TableCell className="py-2 font-mono text-xs text-muted-foreground">
                      {control.code}
                    </TableCell>
                    <TableCell className="min-w-[280px] max-w-[50%] py-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="whitespace-normal wrap-break-word">
                          {control.question}
                        </span>
                        {isAssigned && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground">
                            <User className="h-3.5 w-3.5" aria-hidden />
                            Assigned{assigneeUser?.name ? ` • ${assigneeUser.name}` : ""}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant={complianceStatusVariant(statusCode)} className="text-xs">
                        {statusName}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-xs tabular-nums text-muted-foreground">
                      {completion}%
                    </TableCell>
                    <TableCell className="py-2 pr-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            Action
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isAssigned && (
                            <DropdownMenuItem onClick={() => onViewAssignee?.(control)}>
                              <User className="mr-2 h-4 w-4" />
                              View assignee
                            </DropdownMenuItem>
                          )}
                          {compliant ? (
                            <DropdownMenuItem onClick={() => onUploadEvidence?.(control)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload evidence
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => onOpenActionModal?.(control)}>
                                <PenLine className="mr-2 h-4 w-4" />
                                Update status
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onAssign?.(control)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
  const [uploadEvidenceControl, setUploadEvidenceControl] = useState<AssessmentControl | null>(null)
  const [uploadEvidenceFiles, setUploadEvidenceFiles] = useState<File[]>([])
  const [assignControl, setAssignControl] = useState<AssessmentControl | null>(null)
  const [assignMembers, setAssignMembers] = useState<CompanyMember[]>([])
  const [assignMembersLoading, setAssignMembersLoading] = useState(false)
  const [assigningMemberId, setAssigningMemberId] = useState<string | null>(null)
  const [viewAssigneeControl, setViewAssigneeControl] = useState<AssessmentControl | null>(null)
  const [assigneeMember, setAssigneeMember] = useState<CompanyMember | null>(null)
  const [assigneeLoading, setAssigneeLoading] = useState(false)
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

  useEffect(() => {
    if (uploadEvidenceControl) setUploadEvidenceFiles([])
  }, [uploadEvidenceControl])

  useEffect(() => {
    if (!assignControl || !assessment?.companyId) {
      setAssignMembers([])
      return
    }
    setAssignMembersLoading(true)
    fetchCompanyMembers(assessment.companyId)
      .then((res) => setAssignMembers(res.members ?? []))
      .catch(() => setAssignMembers([]))
      .finally(() => setAssignMembersLoading(false))
  }, [assignControl, assessment?.companyId])

  useEffect(() => {
    if (!viewAssigneeControl || !assessment?.companyId) {
      setAssigneeMember(null)
      return
    }
    const assignedToRaw = viewAssigneeControl.progress?.assignedTo as AssignedToRaw
    const assignedToId = getAssignedToId(assignedToRaw)
    if (!assignedToId) {
      setAssigneeMember(null)
      return
    }
    setAssigneeLoading(true)
    fetchCompanyMembers(assessment.companyId)
      .then((res) => {
        const members = res.members ?? []
        const member =
          members.find((m) => m.id === assignedToId) ??
          members.find((m) => m.user?.id === assignedToId) ??
          null
        setAssigneeMember(member)
      })
      .catch(() => setAssigneeMember(null))
      .finally(() => setAssigneeLoading(false))
  }, [viewAssigneeControl, assessment?.companyId])

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
            onAssign={setAssignControl}
            onUploadEvidence={setUploadEvidenceControl}
            onViewAssignee={setViewAssigneeControl}
          />
          <Sheet
            open={!!uploadEvidenceControl}
            onOpenChange={(open) => {
              if (!open) {
                setUploadEvidenceControl(null)
                setUploadEvidenceFiles([])
              }
            }}
          >
            <SheetContent side="right" className="flex max-h-dvh w-1/4 flex-col p-0 sm:w-1/3 sm:max-w-none">
              <SheetHeader className="shrink-0 px-6 pt-6">
                <SheetTitle>Upload evidence</SheetTitle>
                {uploadEvidenceControl && (
                  <SheetDescription asChild>
                    <div className="space-y-2">
                      <span className="font-mono text-xs">{uploadEvidenceControl.code}</span>
                      <p className="whitespace-normal wrap-break-word text-sm text-muted-foreground">
                        {uploadEvidenceControl.question}
                      </p>
                    </div>
                  </SheetDescription>
                )}
              </SheetHeader>
              {uploadEvidenceControl && (
                <ScrollArea className="min-h-0 flex-1 px-6">
                  <div className="grid gap-4 pb-6 pr-4 pt-2">
                    {uploadEvidenceControl.requiredEvidence?.length > 0 ? (
                      <div className="text-sm">
                        <span className="font-medium">Required documents</span>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                          {uploadEvidenceControl.requiredEvidence.map((doc, i) => (
                            <li key={i}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <FileUpload
                      label="Upload files"
                      accept="image/*"
                      multiple={true}
                      files={uploadEvidenceFiles}
                      onFilesChange={setUploadEvidenceFiles}
                      description="Attach evidence documents"
                    />
                  </div>
                </ScrollArea>
              )}
            </SheetContent>
          </Sheet>
          {/* Assign Sheet */}
          <Sheet open={!!assignControl} onOpenChange={(open) => !open && setAssignControl(null)}>
            <SheetContent side="right" className="flex max-h-dvh w-1/4 flex-col p-0 sm:w-1/3 sm:max-w-none">
              <SheetHeader className="shrink-0 px-6 pt-6">
                <SheetTitle>Assign control</SheetTitle>
                {assignControl && (
                  <SheetDescription asChild>
                    <div className="space-y-2">
                      <span className="font-mono text-xs">{assignControl.code}</span>
                      <p className="whitespace-normal wrap-break-word text-sm text-muted-foreground">
                        {assignControl.question}
                      </p>
                    </div>
                  </SheetDescription>
                )}
              </SheetHeader>
              <div className="mt-4 flex flex-1 min-h-0 flex-col px-6">
                <p className="mb-2 text-sm font-medium">Company members</p>
                {assignMembersLoading ? (
                  <ul className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <li key={i}>
                        <Skeleton className="h-14 w-full rounded-md" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ScrollArea className="min-h-0 flex-1 pr-4">
                    <ul className="space-y-2 pb-6">
                      {assignMembers.length === 0 ? (
                        <li className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
                          No members in this company.
                        </li>
                      ) : (
                        assignMembers.map((member) => (
                          <li
                            key={member.id}
                            className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {(member.user?.name ?? `${member.user?.firstName ?? ""} ${member.user?.lastName ?? ""}`.trim()) || "—"}
                              </p>
                              {member.user?.email && (
                                <p className="truncate text-xs text-muted-foreground">{member.user.email}</p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                              disabled={!assignControl || !assessment || assigningMemberId === member.id}
                              onClick={async () => {
                                if (!assignControl || !assessment || !member.id) return
                                setAssigningMemberId(member.id)
                                try {
                                  await assignControlProgress(assignControl.progress.id, {
                                    companyId: assessment.companyId,
                                    memberId: member.id,
                                  })
                                  toast.success("Control assigned successfully")
                                  setAssignControl(null)
                                  const data = await refetchAssessment()
                                  if (data?.functions && selectedFunction) {
                                    const updated = data.functions.find((f) => f.id === selectedFunction.id)
                                    if (updated) setSelectedFunction(updated)
                                  }
                                } catch (err) {
                                  const message = err instanceof Error ? err.message : "Failed to assign control"
                                  toast.error(message)
                                } finally {
                                  setAssigningMemberId(null)
                                }
                              }}
                            >
                              {assigningMemberId === member.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                                  Assigning…
                                </>
                              ) : (
                                "Assign to"
                              )}
                            </Button>
                          </li>
                        ))
                      )}
                    </ul>
                  </ScrollArea>
                )}
              </div>
            </SheetContent>
          </Sheet>
          {/* view assignee sheet */}
          <Sheet open={!!viewAssigneeControl} onOpenChange={(open) => !open && setViewAssigneeControl(null)}>
            <SheetContent side="right" className="flex max-h-dvh w-1/4 flex-col p-0 sm:w-1/3 sm:max-w-none">
              <SheetHeader className="shrink-0 px-6 pt-6">
                <SheetTitle>Assignee details</SheetTitle>
                {viewAssigneeControl && (
                  <SheetDescription asChild>
                    <div className="space-y-2">
                      <span className="font-mono text-xs">{viewAssigneeControl.code}</span>
                      <p className="whitespace-normal wrap-break-word text-sm text-muted-foreground">
                        {viewAssigneeControl.question}
                      </p>
                    </div>
                  </SheetDescription>
                )}
              </SheetHeader>
              <div className="mt-4 flex flex-1 min-h-0 flex-col px-6 pb-6">
                {assigneeLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-md" />
                    ))}
                  </div>
                ) : assigneeMember ? (
                  <div className="space-y-4">
                    <div className="rounded-md border bg-muted/30 p-4 space-y-2">
                      <p className="text-sm font-medium">
                        {(assigneeMember.user?.name ?? `${assigneeMember.user?.firstName ?? ""} ${assigneeMember.user?.lastName ?? ""}`.trim()) || "—"}
                      </p>
                      {assigneeMember.user?.email && (
                        <p className="text-sm text-muted-foreground">{assigneeMember.user.email}</p>
                      )}
                    </div>
                    {viewAssigneeControl?.progress?.assignedToComment && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Comment</p>
                        <p className="text-sm text-muted-foreground rounded-md border bg-muted/30 p-3">
                          {viewAssigneeControl.progress.assignedToComment}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (() => {
                  const assignedToRaw = viewAssigneeControl?.progress?.assignedTo as AssignedToRaw
                  const assignedToId = getAssignedToId(assignedToRaw)
                  const embeddedUser = getAssignedToUserFromRaw(assignedToRaw)
                  if (!assignedToId && !embeddedUser) return <p className="text-sm text-muted-foreground">No assignee.</p>
                  return (
                    <div className="space-y-4">
                      {embeddedUser ? (
                        <div className="rounded-md border bg-muted/30 p-4 space-y-2">
                          <p className="text-sm font-medium">{embeddedUser.name}</p>
                          {embeddedUser.email && (
                            <p className="text-sm text-muted-foreground">{embeddedUser.email}</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Assigned to member (details not available).
                          </p>
                          <p className="font-mono text-xs text-muted-foreground break-all">
                            ID: {assignedToId}
                          </p>
                        </>
                      )}
                      {viewAssigneeControl?.progress?.assignedToComment && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Comment</p>
                          <p className="text-sm text-muted-foreground rounded-md border bg-muted/30 p-3">
                            {viewAssigneeControl.progress.assignedToComment}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </SheetContent>
          </Sheet>

          {/* action modal sheet */}
          <ControlStatusSheet
            open={!!actionModalControl}
            onOpenChange={(open) => !open && setActionModalControl(null)}
            initialStatusCode={actionModalControl?.progress?.status?.code ?? ""}
            initialComment={actionModalControl?.progress?.assignedToComment ?? ""}
            code={actionModalControl?.code ?? ""}
            question={actionModalControl?.question ?? ""}
            requiredEvidence={actionModalControl?.requiredEvidence}
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
                <Badge variant={complianceStatusVariant(assessment.status)} className="text-xs">
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
