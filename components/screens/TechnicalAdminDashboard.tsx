"use client"

import Link from "next/link"
import { Award, CheckCircle2, FileText, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type {
  TechnicalAdminMetric,
  TechnicalAdminReviewItem,
} from "@/lib/types/technical-admin-dashboard"

const metrics: TechnicalAdminMetric[] = [
  {
    title: "Pending Reviews",
    value: "5",
    description: "Assessments waiting for technical validation",
  },
  {
    title: "Reports Generated",
    value: "128",
    description: "Compliance reports created by the review team",
  },
  {
    title: "Certificates Issued",
    value: "42",
    description: "Certificates released after payment confirmation",
  },
]

const reviewQueue: TechnicalAdminReviewItem[] = [
  {
    company: "Acme Inc",
    framework: "ISO 27001",
    submittedAt: "2026-01-01",
    status: "Under Review",
    priority: "High",
  },
  {
    company: "Global Tech",
    framework: "BOZ Framework",
    submittedAt: "2025-12-28",
    status: "Pending",
    priority: "Medium",
  },
  {
    company: "Northwind Finance",
    framework: "Zambia Data Protection",
    submittedAt: "2025-12-20",
    status: "Ready for Report",
    priority: "Low",
  },
]

export default function TechnicalAdminDashboard() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3">
            Technical Admin
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">Technical Review Dashboard</h2>
          <p className="text-muted-foreground">
            Review submitted compliance modules, generate reports, and release certificates.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/technical-review">Open review portal</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = [Search, FileText, Award][index]
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Review Queue</CardTitle>
            <CardDescription>Assessments that need technical admin action.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewQueue.map((item) => (
                  <TableRow key={`${item.company}-${item.framework}`}>
                    <TableCell className="font-medium">{item.company}</TableCell>
                    <TableCell>{item.framework}</TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Ready for Report" ? "success" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.priority === "High" ? "warning" : "outline"}>{item.priority}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Next Actions</CardTitle>
            <CardDescription>Common technical admin workflows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Validate submitted evidence",
              "Generate compliance reports",
              "Confirm payment before certificates",
            ].map((action) => (
              <div key={action} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <p className="text-sm">{action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
