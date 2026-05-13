import { jsPDF } from "jspdf"
import { autoTable } from "jspdf-autotable"
import type { StaticImageData } from "next/image"
import trustnetLogo from "@/assets/images/logo.png"
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

function completionScoreRounded(addressedPct: number): number {
  return Math.min(100, Math.max(0, Math.round(Number(addressedPct) || 0)))
}

function drawCompletionScoreBadge(
  doc: jsPDF,
  scorePct: number,
  margin: number,
  pageW: number,
  titleBaselineY: number
): void {
  const boxW = 32
  const boxH = 19
  const boxX = pageW - margin - boxW
  const boxY = titleBaselineY - 11.5

  doc.setDrawColor(35, 35, 35)
  doc.setLineWidth(0.5)
  doc.rect(boxX, boxY, boxW, boxH)

  doc.setFont("helvetica", "bold")
  doc.setTextColor(23, 23, 23)
  doc.setFontSize(7)
  doc.text("Completion score", boxX + boxW / 2, boxY + 5.2, { align: "center" })

  doc.setFontSize(16)
  doc.text(`${scorePct}%`, boxX + boxW / 2, boxY + 15, { align: "center" })
}

/** Writes "Label:" bold + normal value with wrap; continuation lines aligned to margin. Returns next y baseline. */
function writeMetaBoldLabel(
  doc: jsPDF,
  labelNoColon: string,
  value: string,
  x: number,
  startY: number,
  paragraphMaxWidth: number,
  margin: number,
  pageH: number
): number {
  const lineHeight = 4.6
  let y = startY
  const labelTxt = `${labelNoColon.replace(/:$/, "")}:`
  const val = safePdfText(value)

  const newPageCheck = (): void => {
    if (y + lineHeight > pageH - margin) {
      doc.addPage()
      y = margin
    }
  }

  newPageCheck()

  doc.setFontSize(10)
  doc.setTextColor(55, 55, 55)
  doc.setFont("helvetica", "bold")
  doc.text(labelTxt, x, y)
  const labelW = doc.getTextWidth(labelTxt) + 1.5

  doc.setFont("helvetica", "normal")
  const valueWidth = Math.max(24, paragraphMaxWidth - labelW)
  const chunks = val ? doc.splitTextToSize(val, valueWidth) : [""]

  chunks.forEach((line: string, idx: number) => {
    if (idx > 0) {
      y += lineHeight
      if (y > pageH - margin) {
        doc.addPage()
        y = margin
      }
    }
    doc.text(line, idx === 0 ? x + labelW : x, y)
  })

  return y + lineHeight + 1.2
}

/** One baseline row: Bold L1 val1 Bold L2 val2 */
function writeMetaBoldYearType(
  doc: jsPDF,
  year: number,
  typeLabel: string,
  x: number,
  y: number,
  margin: number,
  pageH: number,
  gapBetweenGroups = 5
): number {
  const lineHeight = 4.6
  if (y + lineHeight > pageH - margin) {
    doc.addPage()
    y = margin
  }

  let cx = x
  doc.setFontSize(10)
  doc.setTextColor(55, 55, 55)

  doc.setFont("helvetica", "bold")
  const lb1 = "Year:"
  doc.text(lb1, cx, y)
  cx += doc.getTextWidth(lb1)

  doc.setFont("helvetica", "normal")
  const vy = `${year}`
  doc.text(`${vy}`, cx + 2, y)
  cx += 2 + doc.getTextWidth(vy) + gapBetweenGroups

  doc.setFont("helvetica", "bold")
  const lb2 = "Type:"
  doc.text(lb2, cx, y)
  cx += doc.getTextWidth(lb2)

  doc.setFont("helvetica", "normal")
  doc.text(safePdfText(typeLabel), cx + 2, y)

  return y + lineHeight + 1.2
}

function afterTable(doc: DocWithTable, margin: number): number {
  return (doc.lastAutoTable?.finalY ?? margin) + 8
}

function logoUrlForCurrentOrigin(staticSrc: string): string {
  if (typeof window === "undefined") return staticSrc
  return staticSrc.startsWith("/") ? `${window.location.origin}${staticSrc}` : staticSrc
}

/** Pre-composites logo at low alpha so pdf text stays readable when stamped on top of each page. */
async function fadedTrustnetLogoPng(
  staticImage: StaticImageData,
  alpha: number
): Promise<{ dataUri: string; iw: number; ih: number } | null> {
  if (typeof window === "undefined") return null
  try {
    const url = logoUrlForCurrentOrigin(staticImage.src)
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Watermark image failed to load"))
      img.src = url
    })
    const iw = img.naturalWidth || img.width
    const ih = img.naturalHeight || img.height
    if (!iw || !ih) return null
    const canvas = document.createElement("canvas")
    canvas.width = iw
    canvas.height = ih
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.clearRect(0, 0, iw, ih)
    ctx.globalAlpha = alpha
    ctx.drawImage(img, 0, 0)
    return { dataUri: canvas.toDataURL("image/png"), iw, ih }
  } catch {
    return null
  }
}

function stampWatermarkAllPages(doc: jsPDF, dataUri: string, iw: number, ih: number): void {
  const pageCount = doc.getNumberOfPages()
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const maxWMm = Math.min(pw * 0.62 * 2, pw - 4)
  let wMm = maxWMm
  let hMm = (wMm * ih) / iw
  const maxH = Math.min(ph * 0.5 * 2, ph - 4)
  if (hMm > maxH) {
    hMm = maxH
    wMm = (hMm * iw) / ih
  }
  const x = (pw - wMm) / 2
  const y = (ph - hMm) / 2
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.addImage(dataUri, "PNG", x, y, wMm, hMm, undefined, "FAST")
  }
}

export async function downloadAssessmentComplianceReportPdf(
  data: AssessmentReportData,
  filename: string
): Promise<void> {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentW = pageW - margin * 2
  let y = margin

  const meta = data.meta
  const titleBaselineY = y

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(23, 23, 23)
  doc.text("Compliance assessment report", margin, titleBaselineY)

  drawCompletionScoreBadge(doc, completionScoreRounded(data.overall.addressedPct), margin, pageW, titleBaselineY)

  y = titleBaselineY + 10

  y = writeMetaBoldLabel(doc, "Company", meta.companyName, margin, y, contentW, margin, pageH)
  y = writeMetaBoldLabel(
    doc,
    "Framework",
    `${safePdfText(meta.frameworkName)} (${safePdfText(meta.frameworkCode)})`,
    margin,
    y,
    contentW,
    margin,
    pageH
  )
  y = writeMetaBoldYearType(doc, meta.complianceYear, meta.type, margin, y, margin, pageH)
  y = writeMetaBoldLabel(doc, "Status", meta.assessmentStatus.replace(/_/g, " "), margin, y, contentW, margin, pageH)
  y = writeMetaBoldLabel(doc, "Generated", formatReportTimestamp(meta.generatedAt), margin, y, contentW, margin, pageH)
  if (meta.dueDate) {
    y = writeMetaBoldLabel(doc, "Due", formatReportDateOnly(meta.dueDate), margin, y, contentW, margin, pageH)
  }
  y = writeMetaBoldLabel(doc, "Assessment ID", meta.assessmentId, margin, y, contentW, margin, pageH)

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

  const faded = await fadedTrustnetLogoPng(trustnetLogo as StaticImageData, 0.1)
  if (faded) stampWatermarkAllPages(doc, faded.dataUri, faded.iw, faded.ih)

  const name = filename.endsWith(".pdf") ? filename : `${filename}.pdf`
  doc.save(name)
}
