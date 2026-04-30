"use client"

import { useEffect, useState, type ElementType } from "react"
import { Briefcase, Building2, CalendarDays, Mail, Phone, ShieldCheck, UserRound } from "lucide-react"
import { useAtomValue } from "jotai"
import { activeCompanyAtom } from "@/lib/store/auth"
import { fetchCompanyProfile } from "@/lib/actions/profile"
import { formatDate } from "@/lib/constants/functions"
import type { CompanyProfileResponse } from "@/lib/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Profile() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [profile, setProfile] = useState<CompanyProfileResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!activeCompany?.id) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(false)
    fetchCompanyProfile(activeCompany.id)
      .then(setProfile)
      .catch(() => {
        setProfile(null)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [activeCompany?.id])

  if (loading) return <ProfileSkeleton />

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Could not load profile. Please try again.
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
        Select a company to view your profile.
      </div>
    )
  }

  const { user, membership, company } = profile
  const displayName = user.name || `${user.firstName} ${user.lastName}`.trim()
  const avatarFallback = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">View your account, role, and company membership details.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className="text-xl">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-2xl">{displayName}</CardTitle>
            <CardDescription>{user.jobTitle ?? "No job title added"}</CardDescription>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <Badge key={role.id} variant="secondary">
                  {role.name}
                </Badge>
              ))}
              <Badge variant={membership.status === "ACTIVE" ? "success" : "outline"}>{membership.status}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Personal profile information returned by the profile API.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <ProfileField icon={Mail} label="Email" value={user.email} />
            <ProfileField icon={Phone} label="Phone" value={user.phoneNumber ?? "—"} />
            <ProfileField icon={Briefcase} label="Job Title" value={user.jobTitle ?? "—"} />
            <ProfileField icon={UserRound} label="Timezone" value={user.timezone ?? "—"} />
            <div className="sm:col-span-2">
              <ProfileField icon={UserRound} label="Bio" value={user.bio ?? "—"} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Membership</CardTitle>
            <CardDescription>Your selected company context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileField icon={Building2} label="Company" value={company.name} />
            <ProfileField icon={ShieldCheck} label="Membership Status" value={membership.status} />
            <ProfileField icon={CalendarDays} label="Joined" value={formatDate(membership.createdAt)} />
            <ProfileField icon={CalendarDays} label="Last Updated" value={formatDate(user.updatedAt)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 rounded-lg border bg-accent/5 p-3">
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-20 rounded-lg" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-20 rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
