import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Award, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TechnicalReviewPage() {
  const submissions = [
    {
      company: "Acme Inc",
      framework: "ISO 27001",
      submittedDate: "2026-01-01",
      status: "Under Review",
      completion: "100%",
      paid: true,
    },
    {
      company: "Global Tech",
      framework: "BOZ Framework",
      submittedDate: "2025-12-28",
      status: "Pending",
      completion: "100%",
      paid: false,
    },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Technical Review Portal</h2>
          <p className="text-muted-foreground">
            Review submitted compliance modules and generate reports/certificates.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Submissions</CardTitle>
            <CardDescription>Assessments waiting for technical verification.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{sub.company}</TableCell>
                    <TableCell>{sub.framework}</TableCell>
                    <TableCell>{sub.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "Under Review" ? "secondary" : "outline"}>{sub.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {sub.paid ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                          Unpaid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Review Data
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm">Generate</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Compliance Report
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={!sub.paid}>
                              <Award className="mr-2 h-4 w-4" />
                              Certificate {sub.paid ? "" : "(Requires Payment)"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

// Simple dropdown menu for the table actions
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
