"use client"

import { useCallback, useLayoutEffect, useState } from "react"
import { Award, Download, Shield } from "lucide-react"
import { fetchCertificateById } from "@/lib/actions/certificates"
import type { CertificateDetail } from "@/lib/types/certificate"
import { formatCertificateOrdinalDate } from "@/lib/constants/functions"
import { downloadCertificatePdf } from "@/lib/utils/certificate-pdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

const ISSUING_AUTHORITY_LINE = "OFFICE OF THE DATA PROTECTION COMMISSIONER"
const SIGNATORY_ROLE_LINE = "DATA PROTECTION COMMISSIONER"

function CertificateLandscapePreview({ cert }: { cert: CertificateDetail }) {
  const certNo = cert.id
  const expiry = formatCertificateOrdinalDate(cert.validUntil)

  return (
    <div className="relative mx-auto w-full max-w-[920px] overflow-hidden rounded-sm border-[3px] border-[#d4af37] bg-[#f4f8fc] shadow-lg">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[18%] opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgb(15 40 90) 6px, rgb(15 40 90) 12px)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[18%] opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 6px, rgb(15 40 90) 6px, rgb(15 40 90) 12px)",
        }}
        aria-hidden
      />

      <header className="relative bg-[#0c2a66] px-6 pb-5 pt-6 text-center text-white">
        <div className="mx-auto mb-3 flex min-h-[72px] items-center justify-center">
          {cert.companyLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic remote logo URLs from API
            <img
              src={cert.companyLogoUrl}
              alt=""
              className="max-h-[72px] max-w-[140px] object-contain"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37]/80 bg-white/10">
              <Shield className="h-9 w-9 text-[#d4af37]" aria-hidden />
            </div>
          )}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-xs">
          {ISSUING_AUTHORITY_LINE}
        </p>
      </header>

      <div className="h-1.5 bg-[#d4af37]" aria-hidden />

      <div className="relative px-6 py-8 text-center sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Certificate of</p>
        <p className="mt-1 font-serif text-3xl font-bold uppercase tracking-tight text-neutral-950 sm:text-4xl">
          Accreditation
        </p>

        <p className="mx-auto mt-6 max-w-xl font-serif text-xl font-semibold leading-snug text-neutral-900 sm:text-2xl">
          {cert.companyName}
        </p>

        <div className="mx-auto mt-5 max-w-lg border-t border-[#d4af37]" />

        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-neutral-900">Accredited partner</p>

        <p className="mx-auto mt-4 max-w-2xl font-mono text-xs leading-relaxed text-neutral-700 sm:text-sm">
          This is to certify that the holder has demonstrated compliance with{" "}
          <span className="font-semibold text-neutral-900">{cert.frameworkName}</span>, version{" "}
          {cert.frameworkVersion}, for compliance year {cert.complianceYear}.
        </p>
      </div>

      <footer className="relative bg-[#0c2a66] px-4 pb-6 pt-5 text-white sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/85">Certificate no.</p>
            <div className="mx-auto mt-2 w-28 border-t border-[#d4af37] sm:mx-0" />
            <p className="mt-3 font-mono text-sm font-semibold tabular-nums tracking-tight break-all">{certNo}</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-lg italic text-white/90">_______________</p>
            <div className="mx-auto mt-2 w-40 border-t border-[#d4af37]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-white/90">
              {SIGNATORY_ROLE_LINE}
            </p>
            <p className="mt-1 text-sm font-bold">{cert.issuedBy.name}</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/85">Expiry date</p>
            <div className="mx-auto mt-2 w-28 border-t border-[#d4af37] sm:ml-auto sm:mr-0" />
            <p className="mt-3 font-mono text-sm font-semibold">{expiry}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function CertificateDetailScreen({ id }: { id: string }) {
  const [cert, setCert] = useState<CertificateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchCertificateById(id)
      .then(setCert)
      .catch((e: unknown) => {
        setCert(null)
        const msg = e instanceof Error ? e.message : null
        setError(msg ?? "Could not load this certificate.")
      })
      .finally(() => setLoading(false))
  }, [id])

  useLayoutEffect(() => {
    load()
  }, [load])

  const handleDownloadPdf = () => {
    if (!cert) return
    downloadCertificatePdf(cert)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-36 w-full max-w-[920px] rounded-lg" />
        </div>
        <Skeleton className="mx-auto aspect-297/210 w-full max-w-[920px] rounded-lg" />
      </div>
    )
  }

  if (error || !cert) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="flex flex-col gap-4 py-8 text-center">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{error ?? "Certificate not found."}</p>
          <Button variant="outline" onClick={load} type="button">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Certificate</h2>
              <Badge variant="secondary" className="uppercase">
                {cert.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{cert.frameworkName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="gap-2" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4" aria-hidden />
              Download PDF
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="grid gap-3 py-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Issued</p>
              <p className="font-medium">{formatCertificateOrdinalDate(cert.issuedAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valid from</p>
              <p className="font-medium">{formatCertificateOrdinalDate(cert.validFrom)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Certificate reference</p>
              <p className="font-mono font-medium break-all">{cert.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Issuer email</p>
              <p className="font-medium">{cert.issuedBy.email}</p>
            </div>
            {cert.reviewerNotes ? (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Reviewer notes</p>
                <p className="mt-1 rounded-md border bg-muted/30 p-3 text-foreground">{cert.reviewerNotes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto pb-2">
        <CertificateLandscapePreview cert={cert} />
      </div>
    </div>
  )
}
