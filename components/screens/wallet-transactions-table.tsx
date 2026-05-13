"use client"

import { useEffect, useState } from "react"
import { fetchWalletTransactionsPage } from "@/lib/actions/wallet"
import type { WalletLedgerTransaction, WalletTransactionsPage } from "@/lib/types/wallet"
import { formatDate, formatZmwAmount } from "@/lib/constants/functions"
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

function badgeVariantForStatus(status: string | null): "default" | "secondary" | "destructive" | "success" | "outline" | "warning" {
  const s = (status ?? "").toUpperCase()
  if (s.includes("SUCCESS") || s.includes("COMPLET") || s.includes("CONFIRM")) return "success"
  if (s.includes("PENDING") || s.includes("PROCESS")) return "warning"
  if (s.includes("FAIL") || s.includes("REVERS") || s.includes("CANCEL")) return "destructive"
  return "outline"
}

function formatCredits(amount: number | null, direction: string | null): string {
  if (amount == null) return "—"
  let v = Math.round(amount * 100) / 100
  const dir = (direction ?? "").toUpperCase()
  const treatAsDebit =
    dir.includes("DEBIT") ||
    dir.includes("USAGE") ||
    dir === "OUT" ||
    dir === "WITHDRAWAL"
  const treatAsCredit =
    dir.includes("CREDIT") || dir === "IN" || dir === "TOP_UP" || dir === "TOPUP"
  if (treatAsDebit && v > 0) v = -v
  else if (treatAsCredit && v < 0) v = Math.abs(v)
  const sign = v > 0 ? "+" : ""
  return `${sign}${v} credits`
}

export function WalletTransactionsTable({ companyId }: { companyId: string | undefined | null }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState<WalletTransactionsPage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [companyId, pageSize])

  useEffect(() => {
    if (!companyId) {
      setData(null)
      setLoading(false)
      setError(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchWalletTransactionsPage(companyId, page, pageSize)
      .then((response) => {
        if (cancelled) return
        setData(response)
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [companyId, page, pageSize, reloadKey])

  const refetch = () => {
    setError(false)
    setReloadKey((k) => k + 1)
  }

  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">Select a company to load transactions.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center">
        <p className="text-sm text-destructive">Could not load transactions. Please try again.</p>
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
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <>
              {totalItems === 0 ? "No transactions" : `${fromIdx}–${toIdx} of ${totalItems}`}
            </>
          )}
        </p>
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
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="min-w-[180px] whitespace-normal">Description</TableHead>
              <TableHead className="w-28">Type</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">ZMW</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-28">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full max-w-xs" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-14" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-14" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-14" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : !data || data.items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No transactions match this page.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((row: WalletLedgerTransaction) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs text-muted-foreground tabular-nums">
                    {row.createdAt ? formatDate(row.createdAt) : "—"}
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-sm" title={row.description}>
                    {row.description}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.direction ? row.direction.replace(/_/g, " ") : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    {formatCredits(row.amountCredits, row.direction)}
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                    {formatZmwAmount(row.amountZmw)}
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                    {row.balanceAfterCredits == null ? "—" : `${row.balanceAfterCredits}`}
                  </TableCell>
                  <TableCell>
                    {row.status ? (
                      <Badge variant={badgeVariantForStatus(row.status)} className="text-[10px]">
                        {row.status.replace(/_/g, " ")}
                      </Badge>
                    ) : (
                      "—"
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
