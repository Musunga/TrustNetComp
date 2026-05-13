"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { fetchAssistedAssessmentEngagementsPage } from "@/lib/actions/assisted-assessments"
import type { AssistedAssessmentEngagement, AssistedAssessmentEngagementsPage } from "@/lib/types/assisted-assessment-engagements"
import { formatDate } from "@/lib/constants/functions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

function statusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "success" | "outline" | "warning" {
  const s = status.toUpperCase().replace(/\s+/g, "_")
  if (s === "REQUESTED") return "warning"
  if (s === "IN_PROGRESS" || s === "UNDER_REVIEW") return "secondary"
  if (s === "COMPLETED" || s === "APPROVED") return "success"
  if (s === "REJECTED" || s === "CANCELLED") return "destructive"
  return "outline"
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ")
}

function assigneesLabel(members: AssistedAssessmentEngagement["assignedMembers"]): string {
  if (!members.length) return "—"
  const names = members.map((m) => m.name ?? m.email).filter(Boolean)
  if (names.length === 0) return "—"
  if (names.length <= 2) return names.join(", ")
  return `${names[0]} +${names.length - 1}`
}

export function AssistedAssessmentReviewQueueTable({
  onPendingTotalChange,
}: {
  onPendingTotalChange?: (totalItems: number | null) => void
}) {
  const onPendingTotalRef = useRef(onPendingTotalChange)
  onPendingTotalRef.current = onPendingTotalChange

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState<AssistedAssessmentEngagementsPage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [pageSize])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchAssistedAssessmentEngagementsPage(page, pageSize)
      .then((response) => {
        if (cancelled) return
        setData(response)
        onPendingTotalRef.current?.(response.totalItems)
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setData(null)
          onPendingTotalRef.current?.(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page, pageSize, reloadKey])

  const refetch = () => {
    setError(false)
    setReloadKey((k) => k + 1)
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center">
        <p className="text-sm text-destructive">Could not load assisted assessment requests.</p>
        <Button className="mt-4" variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  const totalPages = data?.totalPages ?? 0
  const totalItems = data?.totalItems ?? 0
  const fromIdx = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const toIdx = totalItems === 0 ? 0 : Math.min(page * pageSize, totalItems)
  const canPrev = page > 1
  const canNext = totalPages > 0 && page < totalPages

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <>{totalItems === 0 ? "No assisted assessment requests" : `${fromIdx}–${toIdx} of ${totalItems}`}</>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={refetch} disabled={loading}>
            Refresh
          </Button>
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v))
            }}
          >
            <SelectTrigger size="sm" className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[140px]">Company</TableHead>
              <TableHead className="min-w-[160px] whitespace-normal">Framework</TableHead>
              <TableHead className="min-w-[140px] whitespace-normal">Requested by</TableHead>
              <TableHead className="w-32">Submitted</TableHead>
              <TableHead className="min-w-[100px]">Assignees</TableHead>
              <TableHead className="min-w-[140px]">Progress</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-28 text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data || data.items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No assisted assessment requests on this page.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((row: AssistedAssessmentEngagement) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.company.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{row.framework.name}</span>
                      {row.framework.code ? (
                        <Badge variant="outline" className="w-fit text-[10px] font-normal">
                          {row.framework.code}
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{row.requestedBy.name}</span>
                      {row.requestedBy.email ? (
                        <span className="truncate text-xs text-muted-foreground" title={row.requestedBy.email}>
                          {row.requestedBy.email}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-muted-foreground">
                    {row.createdAt ? formatDate(row.createdAt) : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{assigneesLabel(row.assignedMembers)}</TableCell>
                  <TableCell className="align-middle">
                    <div className="flex min-w-32 flex-col gap-1.5 py-0.5">
                      <Progress value={row.progress.percentage} className="h-2" aria-label={`Assessment progress ${row.progress.percentage}%`} />
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {row.progress.totalControls > 0
                          ? `${row.progress.completedControls}/${row.progress.totalControls} (${row.progress.percentage}%)`
                          : `${row.progress.percentage}%`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(row.status)} className="text-[10px]">
                      {formatStatusLabel(row.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.companyFrameworkId.trim() ? (
                      <Button variant="outline" size="sm" asChild className="h-8">
                        <Link href={`/dashboard/assessments/${row.companyFrameworkId}`}>Details</Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && totalItems > 0 ? (
        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            Page {Math.min(page, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!canPrev} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!canNext} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
