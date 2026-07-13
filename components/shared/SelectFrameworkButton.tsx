"use client"

import { selectFramework } from "@/lib/actions/frameworks"
import { activeCompanyAtom } from "@/lib/store/auth"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SelectableFramework {
  code: string
  name: string
}

export default function SelectFrameworkButton({
  framework,
  size = "sm",
}: {
  framework: SelectableFramework
  size?: "sm" | "default"
}) {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [selecting, setSelecting] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function handleSelect() {
    if (!activeCompany?.id) return
    setConfirming(false)
    setSelecting(true)
    try {
      await selectFramework({
        companyId: activeCompany.id,
        frameworkCode: framework.code,
        year: new Date().getFullYear(),
      })
      toast.success("Framework selected", {
        description: `${framework.name} has been added for ${new Date().getFullYear()}.`,
      })
      setTimeout(() => window.location.reload(), 1500)
    } catch {
      toast.error("Failed to select framework")
    } finally {
      setSelecting(false)
    }
  }

  return (
    <>
      <Button
        variant="default"
        size={size}
        disabled={!activeCompany?.id || selecting}
        onClick={() => setConfirming(true)}
      >
        {selecting ? "Selecting…" : "Select"}
      </Button>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm selection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to take the assessment you selected?
              <span className="mt-2 block font-medium text-foreground">
                {framework.name}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSelect} disabled={selecting}>
              {selecting ? "Selecting…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
