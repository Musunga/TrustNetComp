"use client"

import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { activeCompanyAtom } from "@/lib/store/auth"
import { fetchCompanyMembers } from "@/lib/actions/companies"
import { fetchCompanyInvitations, deleteInvitation, resendInvitation } from "@/lib/actions/invitations"
import type { CompanyMembersResponse, CompanyMember } from "@/lib/types/company-members"
import type { CompanyInvitation } from "@/lib/types/company-invitations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MoreVertical,
  Send,
  X,
} from "lucide-react"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "success" | "outline" {
  const s = (status ?? "").toUpperCase()
  switch (s) {
    case "ACTIVE":
    case "INVITED":
      return "success"
    case "SUSPENDED":
      return "destructive"
    case "REVOKED":
      return "outline"
    default:
      return "secondary"
  }
}

export default function Team() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [data, setData] = useState<CompanyMembersResponse | null>(null)
  const [invitations, setInvitations] = useState<CompanyInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [invitationsLoading, setInvitationsLoading] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [invitationToRevoke, setInvitationToRevoke] = useState<CompanyInvitation | null>(null)
  const [revoking, setRevoking] = useState(false)
  const [resendDialogOpen, setResendDialogOpen] = useState(false)
  const [invitationToResend, setInvitationToResend] = useState<CompanyInvitation | null>(null)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!activeCompany?.id) {
      setData(null)
      setInvitations([])
      setLoading(false)
      setInvitationsLoading(false)
      return
    }
    setLoading(true)
    fetchCompanyMembers(activeCompany.id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [activeCompany?.id])

  useEffect(() => {
    if (!activeCompany?.id) return
    setInvitationsLoading(true)
    fetchCompanyInvitations(activeCompany.id)
      .then((res) => setInvitations(res.invitations ?? []))
      .catch(() => setInvitations([]))
      .finally(() => setInvitationsLoading(false))
  }, [activeCompany?.id])

  const handleRevokeClick = (invitation: CompanyInvitation) => {
    setInvitationToRevoke(invitation)
    setRevokeDialogOpen(true)
  }

  const handleRevokeConfirm = async () => {
    if (!invitationToRevoke || !activeCompany?.id) return

    setRevoking(true)
    try {
      await deleteInvitation(invitationToRevoke.id, {
        companyId: activeCompany.id,
      })
      toast.success("Invitation revoked", {
        description: `Invitation for ${invitationToRevoke.email} has been revoked.`,
      })
      setRevokeDialogOpen(false)
      setInvitationToRevoke(null)

      // Refresh invitations list
      const res = await fetchCompanyInvitations(activeCompany.id)
      setInvitations(res.invitations ?? [])
    } catch {
      toast.error("Failed to revoke invitation")
    } finally {
      setRevoking(false)
    }
  }

  const handleResendClick = (invitation: CompanyInvitation) => {
    setInvitationToResend(invitation)
    setResendDialogOpen(true)
  }

  const handleResendConfirm = async () => {
    if (!invitationToResend || !activeCompany?.id) return

    setResending(true)
    try {
      await resendInvitation(invitationToResend.id, {
        companyId: activeCompany.id,
      })
      toast.success("Invitation resent", {
        description: `Invitation for ${invitationToResend.email} has been resent.`,
      })
      setResendDialogOpen(false)
      setInvitationToResend(null)
    } catch {
      toast.error("Failed to resend invitation")
    } finally {
      setResending(false)
    }
  }

  if (loading) {
    return (
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Current members of the compliance team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activeCompany) {
    return (
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Select a company to view members.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No company selected.</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Current members of {activeCompany.name}&apos;s compliance team.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load members.</p>
        </CardContent>
      </Card>
    )
  }

  const { members } = data

  return (
    <Card className="md:col-span-3">
        <Tabs defaultValue="members" className="w-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  Current members of {activeCompany.name}&apos;s compliance team.
                </CardDescription>
              </div>
              <TabsList className="h-8 shrink-0 rounded-full border bg-muted p-0.5">
                <TabsTrigger
                  value="members"
                  className="h-7 flex-1 rounded-l-full rounded-r-none border-r border-border px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                >
                  Members
                </TabsTrigger>
                <TabsTrigger
                  value="invited"
                  className="h-7 flex-1 rounded-r-full rounded-l-none px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                >
                  Invited
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
        <CardContent>
          <TabsContent value="members" className="mt-4">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="w-[1%] text-right text-xs font-medium text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => {
                    const { user, roles, status } = member
                    const primaryRole = roles[0]
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="text-sm font-medium">{user.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="text-sm">
                          {primaryRole ? (
                            <span className="font-bold">{primaryRole.name}</span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit Role</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          <TabsContent value="invited" className="mt-4">
            {invitationsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending invitations.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Invited by</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Expires</TableHead>
                    <TableHead className="w-[1%] text-right text-xs font-medium text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="text-sm">{inv.email}</TableCell>
                      <TableCell className="text-sm">
                        <span className="font-bold">
                          {inv.role?.name ?? inv.role?.code ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {inv.invitedBy?.name ?? inv.invitedBy?.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant={getStatusBadgeVariant(inv.status)} className="text-xs">
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(inv.expiresAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {inv.status !== "REVOKED" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleResendClick(inv)}
                                  disabled={resending}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Resend invitation
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleRevokeClick(inv)}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Revoke invite
                                </DropdownMenuItem>
                              </>
                            )}
                            {inv.status === "REVOKED" && (
                              <DropdownMenuItem disabled>
                                <span className="text-muted-foreground">No actions available</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>

      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation for{" "}
              <strong>{invitationToRevoke?.email}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeConfirm}
              disabled={revoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revoking ? "Revoking..." : "Revoke Invitation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resend Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resend the invitation for{" "}
              <strong>{invitationToResend?.email}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResendConfirm} disabled={resending}>
              {resending ? "Resending..." : "Resend Invitation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
