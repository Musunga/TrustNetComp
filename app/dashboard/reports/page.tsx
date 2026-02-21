import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            View and download compliance reports for your company.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Reports
            </CardTitle>
            <CardDescription>
              Your generated compliance and assessment reports will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/60" />
              <p className="text-sm font-medium text-muted-foreground">No reports yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Reports will be listed here when available.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
