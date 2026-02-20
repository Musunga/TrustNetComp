import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import AssessmentsList from "@/components/screens/AssessmentsList"

export default async function Page() {


  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Assessments</h2>
          </div>
        </div>
        <AssessmentsList />

      </div>
    </DashboardShell>
  )
}
