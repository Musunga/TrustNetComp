import { jsPDF } from "jspdf"
import { autoTable } from "jspdf-autotable"
import type { AssessmentReportData } from "@/lib/types/assessment-report-data"

type DocWithTable = jsPDF & { lastAutoTable?: { finalY: number } }

function formatReportTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

function formatReportDateOnly(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" })
  } catch {
    return iso
  }
}

function safePdfText(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
}

function afterTable(doc: DocWithTable, margin: number): number {
  return (doc.lastAutoTable?.finalY ?? margin) + 8
}

export function downloadAssessmentComplianceReportPdf(data: AssessmentReportData, filename: string): void {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentW = pageW - margin * 2
  let y = margin

  const meta = data.meta

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(23, 23, 23)
  doc.text("Compliance assessment report", margin, y)
  y += 9

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(55, 55, 55)

  const metaBlocks: string[] = [
    `Company: ${safePdfText(meta.companyName)}`,
    `Framework: ${safePdfText(meta.frameworkName)} (${safePdfText(meta.frameworkCode)})`,
    `Year: ${meta.complianceYear}   Type: ${safePdfText(meta.type)}`,
    `Status: ${safePdfText(meta.assessmentStatus.replace(/_/g, " "))}`,
    `Generated: ${formatReportTimestamp(meta.generatedAt)}`,
    meta.dueDate ? `Due: ${formatReportDateOnly(meta.dueDate)}` : "",
    `Assessment ID: ${meta.assessmentId}`,
  ].filter(Boolean)

  for (const block of metaBlocks) {
    const lines = doc.splitTextToSize(safePdfText(block), contentW)
    if (y + lines.length * 4.6 > pageH - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(lines, margin, y)
    y += lines.length * 4.6 + 1.2
  }

  y += 3
  doc.setDrawColor(210, 210, 210)
  doc.line(margin, y, pageW - margin, y)
  y += 7

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Overall controls", margin, y)
  y += 6

  const o = data.overall
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Metric", "Count", "% of total"]],
    body: [
      ["Total controls", String(o.totalControls), "—"],
      ["Addressed", String(o.addressed), `${o.addressedPct}%`],
      ["Partially addressed", String(o.partiallyAddressed), `${o.partiallyPct}%`],
      ["Not addressed", String(o.notAddressed), `${o.notAddressedPct}%`],
    ],
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [55, 65, 81], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    theme: "striped",
  })
  y = afterTable(doc as DocWithTable, margin)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  if (y + 35 > pageH - margin) {
    doc.addPage()
    y = margin
  }
  doc.text("Maturity level", margin, y)
  y += 6

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(55, 55, 55)
  const maturityBlock = safePdfText(
    `Level ${data.maturityLevel.level} — ${data.maturityLevel.label}\n\n${data.maturityLevel.description}`,
  )
  const matLines = doc.splitTextToSize(maturityBlock, contentW)
  for (let i = 0; i < matLines.length; i++) {
    if (y + 5 > pageH - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(matLines[i]!, margin, y)
    y += 5
  }
  y += 6

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  if (y + 10 > pageH - margin) {
    doc.addPage()
    y = margin
  }
  doc.text("Functions & control areas", margin, y)
  y += 8

  for (const fn of data.functions) {
    if (y + 28 > pageH - margin) {
      doc.addPage()
      y = margin
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10.5)
    doc.setTextColor(23, 23, 23)
    const fnHead = safePdfText(`${fn.code} — ${fn.name}`)
    const fnHeadLines = doc.splitTextToSize(fnHead, contentW)
    for (const line of fnHeadLines) {
      if (y + 5 > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 5
    }

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const summary = safePdfText(
      `Summary: ${fn.totals.addressed}/${fn.totals.total} addressed · ${fn.percentages.addressed}% addressed · ${fn.percentages.partiallyAddressed}% partial · ${fn.percentages.notAddressed}% not addressed`,
    )
    const sumLines = doc.splitTextToSize(summary, contentW)
    for (const line of sumLines) {
      if (y + 4.5 > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 4.5
    }
    y += 2

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Code", "Control area", "Total", "Addr", "Part", "Open"]],
      body: (fn.controlAreas ?? []).map((r) => [
        safePdfText(r.code),
        safePdfText(r.name),
        String(r.total),
        String(r.addressed),
        String(r.partiallyAddressed),
        String(r.notAddressed),
      ]),
      styles: { fontSize: 8, cellPadding: 1.5, valign: "top" },
      headStyles: { fillColor: [55, 65, 81], textColor: 255, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 78 },
        2: { cellWidth: 18, halign: "right" },
        3: { cellWidth: 18, halign: "right" },
        4: { cellWidth: 18, halign: "right" },
        5: { cellWidth: 18, halign: "right" },
      },
      theme: "grid",
    })
    y = afterTable(doc as DocWithTable, margin)
  }

  if (data.certificate != null) {
    if (y + 20 > pageH - margin) {
      doc.addPage()
      y = margin
    }
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(23, 23, 23)
    doc.text("Certificate data", margin, y)
    y += 7

    doc.setFont("courier", "normal")
    doc.setFontSize(7)
    doc.setTextColor(60, 60, 60)
    const raw =
      typeof data.certificate === "string"
        ? data.certificate
        : JSON.stringify(data.certificate, null, 2)
    const rawSafe = safePdfText(raw)
    const certChunks = rawSafe.match(/[\s\S]{1,2000}/g) ?? [rawSafe]
    let linesPrinted = 0
    const maxLines = 120

    outer: for (const chunk of certChunks) {
      const ls = doc.splitTextToSize(chunk, contentW)
      for (const line of ls) {
        if (linesPrinted >= maxLines) break outer
        if (y + 3.8 > pageH - margin) {
          doc.addPage()
          y = margin
        }
        doc.text(line, margin, y)
        y += 3.8
        linesPrinted++
      }
    }
    if (linesPrinted >= maxLines) {
      if (y + 4 > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.setFont("helvetica", "italic")
      doc.text("… (truncated)", margin, y)
      y += 5
    }
  }

  const name = filename.endsWith(".pdf") ? filename : `${filename}.pdf`
  doc.save(name)
}
