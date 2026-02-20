"use client"

import Link from "next/link"
import { fetchAllFrameworks, selectFramework } from "@/lib/actions/frameworks"
import { activeCompanyAtom } from "@/lib/store/auth"
import { Framework } from "@/lib/types"
import { useAtomValue } from "jotai"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { Eye } from "lucide-react"

const FrameworksList = () => {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [loading, setLoading] = useState(true)
  const [selectingCode, setSelectingCode] = useState<string | null>(null)
  const [confirmingFramework, setConfirmingFramework] = useState<Framework | null>(null)

  useEffect(() => {
    fetchAllFrameworks()
      .then((data) => setFrameworks(data))
      .catch(() => setFrameworks([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleSelect(fw: Framework) {
    if (!activeCompany?.id) return
    setConfirmingFramework(null)
    setSelectingCode(fw.code)
    try {
      await selectFramework({
        companyId: activeCompany.id,
        frameworkCode: fw.code,
        year: new Date().getFullYear(),
      })
      toast.success("Framework selected", {
        description: `${fw.name} has been added for ${new Date().getFullYear()}.`,
      })
      setTimeout(() => window.location.reload(), 1500)
    } catch {
      toast.error("Failed to select framework")
    } finally {
      setSelectingCode(null)
    }
  }

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Compliance Frameworks</CardTitle>
          <CardDescription>Available frameworks for your next assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 rounded-lg border bg-accent/5 p-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-8 w-16 shrink-0 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Compliance Frameworks</CardTitle>
        <CardDescription>Available frameworks for your next assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {frameworks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No frameworks available.</p>
        ) : (
          frameworks.map((fw) => (
            <div
              key={String(fw.id)}
              className="flex items-center justify-between gap-4 rounded-lg border bg-accent/5 p-3"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium">{fw.name}</p>
                {fw.description && (
                  <p className="text-xs text-muted-foreground">{fw.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/assessments/preview/${fw.id}`}>
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Preview
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={!activeCompany?.id || selectingCode !== null}
                  onClick={() => setConfirmingFramework(fw)}
                >
                  {selectingCode === fw.code ? "Selecting…" : "Select"}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <AlertDialog
        open={!!confirmingFramework}
        onOpenChange={(open) => !open && setConfirmingFramework(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm selection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to take the assessment you selected?
              {confirmingFramework && (
                <span className="mt-2 block font-medium text-foreground">
                  {confirmingFramework.name}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmingFramework && handleSelect(confirmingFramework)}
              disabled={!confirmingFramework || selectingCode !== null}
            >
              {selectingCode === confirmingFramework?.code ? "Selecting…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default FrameworksList