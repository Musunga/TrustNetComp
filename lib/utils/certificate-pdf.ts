import { jsPDF } from "jspdf"
import type { CertificateDetail } from "@/lib/types/certificate"
import { formatCertificateOrdinalDate } from "@/lib/constants/functions"

const ISSUING_AUTHORITY_LINE = "OFFICE OF THE DATA PROTECTION COMMISSIONER"
const SIGNATORY_ROLE_LINE = "DATA PROTECTION COMMISSIONER"

function safePdfText(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
}

export function downloadCertificatePdf(cert: CertificateDetail, filename?: string): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const navy: [number, number, number] = [12, 42, 102]
  const gold: [number, number, number] = [212, 175, 55]
  const margin = 14

  doc.setDrawColor(...gold)
  doc.setLineWidth(0.55)
  doc.rect(3.5, 3.5, W - 7, H - 7)

  doc.setFillColor(...navy)
  doc.rect(0, 0, W, 42, "F")

  doc.setDrawColor(...gold)
  doc.setLineWidth(1.2)
  doc.line(0, 42, W, 42)

  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text(ISSUING_AUTHORITY_LINE, W / 2, 26, { align: "center" })

  doc.setTextColor(28, 28, 28)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text("CERTIFICATE OF", W / 2, 54, { align: "center" })
  doc.setFontSize(22)
  doc.text("ACCREDITATION", W / 2, 66, { align: "center" })

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  const companyLines = doc.splitTextToSize(safePdfText(cert.companyName), W - margin * 2 - 12)
  let y = 78
  doc.text(companyLines, W / 2, y, { align: "center" })
  y += companyLines.length * 6 + 4

  doc.setDrawColor(...gold)
  doc.setLineWidth(0.35)
  doc.line(margin + 28, y, W - margin - 28, y)
  y += 8

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("ACCREDITED PARTNER", W / 2, y, { align: "center" })
  y += 10

  doc.setFont("courier", "normal")
  doc.setFontSize(9)
  const statement = `This is to certify that the holder has demonstrated compliance with ${cert.frameworkName}, version ${cert.frameworkVersion}, for compliance year ${cert.complianceYear}.`
  const stmtLines = doc.splitTextToSize(safePdfText(statement), W - margin * 2 - 18)
  doc.text(stmtLines, W / 2, y, { align: "center" })

  const footTop = H - 30
  doc.setFillColor(...navy)
  doc.rect(0, footTop, W, H - footTop, "F")

  const lineY = H - 18
  doc.setDrawColor(...gold)
  doc.setLineWidth(0.5)
  doc.line(margin, lineY, margin + 55, lineY)
  doc.line(W / 2 - 36, lineY, W / 2 + 36, lineY)
  doc.line(W - margin - 55, lineY, W - margin, lineY)

  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text("CERTIFICATE NO.", margin, footTop + 8)
  doc.text("EXPIRY DATE", W - margin, footTop + 8, { align: "right" })

  doc.setFontSize(10)
  doc.text(safePdfText(cert.id), margin, H - 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  const expiry = formatCertificateOrdinalDate(cert.validUntil)
  doc.text(safePdfText(expiry), W - margin, H - 8, { align: "right" })

  doc.setFont("helvetica", "italic")
  doc.setFontSize(9)
  doc.text("_________________________", W / 2, footTop + 10, { align: "center" })
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text(SIGNATORY_ROLE_LINE, W / 2, footTop + 18, { align: "center" })
  doc.setFontSize(10)
  doc.text(safePdfText(cert.issuedBy.name), W / 2, footTop + 24, { align: "center" })

  doc.save(filename ?? `certificate-${cert.id.slice(0, 8)}.pdf`)
}
