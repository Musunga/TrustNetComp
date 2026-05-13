"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AssessmentComplianceReportSkeleton } from "@/components/screens/assessment-compliance-report-skeleton"
import { AssessmentComplianceReport } from "@/components/screens/AssessmentComplianceReport"
import { fetchAssessmentReportData } from "@/lib/actions/frameworks"
import type { AssessmentReportData } from "@/lib/types/assessment-report-data"
import { downloadAssessmentComplianceReportPdf } from "@/lib/utils/assessment-compliance-report-pdf"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AssessmentReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [data, setData] = useState<AssessmentReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)
    fetchAssessmentReportData(id)
      .then((res) => {
        if (!ignore) setData(res)
      })
      .catch(() => {
        if (!ignore) {
          setError("Could not load report data.")
          setData(null)
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [id])

  async function handleDownloadPdf() {
    if (!data) {
      toast.error("Report is not ready to export.")
      return
    }
    setPdfLoading(true)
    try {
      const safeName = `assessment-report-${data.meta.frameworkCode.replace(/[^a-zA-Z0-9-_]/g, "_")}-${data.meta.complianceYear}`
      await downloadAssessmentComplianceReportPdf(data, `${safeName}.pdf`)
      toast.success("PDF downloaded.")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not generate PDF."
      toast.error(msg.length > 200 ? `${msg.slice(0, 200)}…` : msg)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Button variant="outline" className="gap-2" asChild>
              <Link href={`/dashboard/assessments/${id}`}>
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Assessment report</h1>
          </div>
          <Button
            type="button"
            className="gap-2 sm:shrink-0"
            disabled={!data || pdfLoading}
            onClick={() => handleDownloadPdf()}
          >
            {pdfLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            Download PDF
          </Button>
        </div>

        {loading ? (
          <div className="mx-auto w-full pb-8" aria-busy="true">
            <AssessmentComplianceReportSkeleton />
          </div>
        ) : null}

        {!loading && error ? (
          <Card className="border-destructive/40">
            <CardContent className="py-8 text-center text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : null}

        {data ? (
          <div className="mx-auto w-full pb-8">
            <AssessmentComplianceReport data={data} />
          </div>
        ) : null}
      </div>
    </DashboardShell>
  )
}
