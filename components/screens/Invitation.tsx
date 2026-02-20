"use client"

import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { activeCompanyAtom } from "@/lib/store/auth"
import { fetchUserRoles, createInvitation } from "@/lib/actions/invitations"
import type { UserRole } from "@/lib/types/user-roles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_EXPIRES_IN_DAYS = 7

export default function Invitation() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [roleCode, setRoleCode] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUserRoles()
      .then((data) => setRoles(data.roles ?? []))
      .catch(() => setRoles([]))
      .finally(() => setRolesLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activeCompany?.id || !roleCode.trim()) return
    const emails = email
      .split(/[\s,]+/)
      .map((e) => e.trim())
      .filter(Boolean)
    if (emails.length === 0) {
      toast.error("Enter at least one email address")
      return
    }
    setSubmitting(true)
    try {
      await createInvitation({
        emails,
        roleCode: roleCode.trim(),
        companyId: activeCompany.id,
        expiresInDays: DEFAULT_EXPIRES_IN_DAYS,
      })
      toast.success("Invitation sent", {
        description: `${emails.length} invitation(s) sent.`,
      })
      setEmail("")
    } catch {
      toast.error("Failed to send invitation")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Invite Member</CardTitle>
        <CardDescription>Send an invitation to join the team.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address(es)</Label>
            <Input
              id="email"
              type="text"
              placeholder="colleague@acme.inc (comma-separated for multiple)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!activeCompany?.id}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            {rolesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={roleCode}
                onValueChange={setRoleCode}
                disabled={!activeCompany?.id}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.code}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              !activeCompany?.id ||
              !email.trim() ||
              !roleCode ||
              submitting ||
              rolesLoading
            }
          >
            <Mail className="mr-2 h-4 w-4" />
            {submitting ? "Sending…" : "Send Invitation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
