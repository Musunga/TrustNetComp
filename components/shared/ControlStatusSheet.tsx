"use client"

import React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUpload } from "@/components/shared/FileUpload"

const COMPLIANCE_OPTIONS = [
  { value: "COMPLIANT", label: "Compliant" },
  { value: "NOT_COMPLIANT", label: "Non-compliant" },
] as const

export interface ControlStatusSheetPayload {
  statusCode: string
  assignedToComment: string
  attachedEvidence: string[]
}

export interface ControlStatusSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStatusCode: string
  initialComment: string
  code: string
  question: string
  requiredEvidence?: string[]
  onSave?: (payload: ControlStatusSheetPayload) => Promise<void>
}

export function ControlStatusSheet({
  open,
  onOpenChange,
  initialStatusCode,
  initialComment,
  code,
  question,
  requiredEvidence = [],
  onSave,
}: ControlStatusSheetProps) {
  const [status, setStatus] = React.useState(initialStatusCode)
  const [assignedToComment, setAssignedToComment] = React.useState(initialComment)
  const [files, setFiles] = React.useState<File[]>([])
  const [saving, setSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setStatus(initialStatusCode)
      setAssignedToComment(initialComment)
      setFiles([])
      setSaveError(null)
    }
  }, [open, initialStatusCode, initialComment])

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex max-h-dvh w-1/4 flex-col p-0 sm:w-1/3 sm:max-w-none">
      <ScrollArea className="min-h-0 flex-1 px-6">
        <SheetHeader className="shrink-0 px-6 pt-6">
          <SheetTitle>Update control status</SheetTitle>
          <SheetDescription asChild>
            <div className="space-y-2">
              <span className="font-mono text-xs">{code}</span>
              <p className="whitespace-normal wrap-break-word text-sm text-muted-foreground">
                {question}
              </p>
              {requiredEvidence.length > 0 ? (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Required documents:</span>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {requiredEvidence.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </SheetDescription>
        </SheetHeader>
     
          <div className="grid gap-4 pb-6 pr-4">
            <div className="grid gap-2">
              <Label htmlFor="control-status">Compliance status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="control-status" className="w-full">
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
              <Label htmlFor="control-comment">Comment</Label>
              <Textarea
                id="control-comment"
                placeholder="e.g. All controls have been implemented and documented."
                value={assignedToComment}
                onChange={(e) => setAssignedToComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            <FileUpload
              label="Upload images (optional)"
              accept="image/*"
              multiple={true}
              files={files}
              onFilesChange={setFiles}
              description="Supports multiple image files"
            />
            {saveError && (
              <p className="text-sm text-destructive">{saveError}</p>
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="shrink-0 border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !status}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
