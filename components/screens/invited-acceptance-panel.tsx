"use client"

import { use, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import InvitationAcceptanceForm from "@/components/forms/invitation-acceptance-form"

function InvitedFormInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const token = searchParams.get("id") || ""

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[480px] md:w-[640px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Accept Invitation</h1>
        <p className="text-sm text-muted-foreground">
          Complete your profile to join the compliance team
        </p>
      </div>
      <InvitationAcceptanceForm invitationId={id ?? token} />
    </div>
  )
}

export function InvitedAcceptancePanel({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="lg:p-8">
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[200px] w-full max-w-[640px] items-center justify-center text-muted-foreground">
            Loading…
          </div>
        }
      >
        <InvitedFormInner params={params} />
      </Suspense>
    </div>
  )
}
