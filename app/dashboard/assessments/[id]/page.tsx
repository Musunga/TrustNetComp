'use client'

import { use } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import AssessmentDetails from "@/components/screens/AssessmentDetails"

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <DashboardShell>
      <AssessmentDetails id={id} />
    </DashboardShell>
  )
}
