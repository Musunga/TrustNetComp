"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import FrameworkPreview from "@/components/screens/FrameworkPreview"
import SelectFrameworkButton from "@/components/shared/SelectFrameworkButton"
import { ArrowLeft } from "lucide-react"

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [framework, setFramework] = useState<{ code: string; name: string } | null>(null)

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Framework Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {framework ? <SelectFrameworkButton framework={framework} size="default" /> : null}
          </div>
        </div>
        <FrameworkPreview id={id} onFrameworkLoaded={setFramework} />
      </div>
    </DashboardShell>
  )
}
