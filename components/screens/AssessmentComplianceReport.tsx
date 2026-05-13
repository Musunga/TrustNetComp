"use client"

import type { CSSProperties } from "react"
import type { AssessmentReportData } from "@/lib/types/assessment-report-data"

const pdfInk = "#171717"
const pdfBody = "#373737"
const pdfMuted = "#505050"
const pdfTableHead = [55, 65, 81] as const
const pdfRowAlt = "rgb(249 250 251)"
const pdfLine = "#d2d2d2"

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

export function AssessmentComplianceReport({ data }: { data: AssessmentReportData }) {
  const { meta, overall: o, functions: fnSections, maturityLevel, certificate } = data

  const overallBody: ReadonlyArray<{ label: string; count: number; pct: string }> = [
    { label: "Total controls", count: o.totalControls, pct: "—" },
    { label: "Addressed", count: o.addressed, pct: `${o.addressedPct}%` },
    { label: "Partially addressed", count: o.partiallyAddressed, pct: `${o.partiallyPct}%` },
    { label: "Not addressed", count: o.notAddressed, pct: `${o.notAddressedPct}%` },
  ]

  const metaLines = [
    `Company: ${meta.companyName}`,
    `Framework: ${meta.frameworkName} (${meta.frameworkCode})`,
    `Year: ${meta.complianceYear}   Type: ${meta.type}`,
    `Status: ${meta.assessmentStatus.replace(/_/g, " ")}`,
    `Generated: ${formatReportTimestamp(meta.generatedAt)}`,
    ...(meta.dueDate ? [`Due: ${formatReportDateOnly(meta.dueDate)}`] : []),
    `Assessment ID: ${meta.assessmentId}`,
  ]

  return (
    <article
      className="assessment-compliance-report mx-auto max-w-[210mm] rounded-sm border border-neutral-300 bg-white px-[14mm] py-10 font-sans shadow-sm print:border-0 print:py-8 print:shadow-none"
      style={{ color: pdfBody }}
    >
      <header>
        <h1 className="text-[16pt] font-bold leading-tight" style={{ color: pdfInk }}>
          Compliance assessment report
        </h1>
        <ul className="mt-4 list-none space-y-1 text-[10pt] leading-snug">
          {metaLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </header>

      <hr className="my-6 border-0 border-t" style={{ borderColor: pdfLine }} />

      <section className="mt-7">
        <h2 className="text-[12pt] font-bold" style={{ color: pdfInk }}>
          Overall controls
        </h2>
        <table className="mt-3 w-full border-collapse text-[9pt]">
          <thead>
            <tr
              className="text-left font-bold text-white"
              style={{ backgroundColor: `rgb(${pdfTableHead.join(" ")})` }}
            >
              <th className="px-2 py-2">Metric</th>
              <th className="px-2 py-2">Count</th>
              <th className="px-2 py-2">% of total</th>
            </tr>
          </thead>
          <tbody>
            {overallBody.map((row, i) => {
              const alt: CSSProperties =
                i % 2 === 1 ? { backgroundColor: pdfRowAlt } : { backgroundColor: "#ffffff" }
              return (
                <tr key={row.label} style={alt}>
                  <td className="px-2 py-2">{row.label}</td>
                  <td className="px-2 py-2 tabular-nums">{row.count}</td>
                  <td className="px-2 py-2 tabular-nums">{row.pct}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="text-[12pt] font-bold" style={{ color: pdfInk }}>
          Maturity level
        </h2>
        <div className="mt-3 text-[10pt] leading-relaxed whitespace-pre-wrap" style={{ color: pdfBody }}>
          {`Level ${maturityLevel.level} — ${maturityLevel.label}\n\n${maturityLevel.description}`}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[12pt] font-bold" style={{ color: pdfInk }}>
          Functions &amp; control areas
        </h2>
        <div className="mt-6 space-y-8">
          {fnSections.map((fn) => (
            <div key={fn.code} className="break-inside-avoid">
              <h3 className="text-[10.5pt] font-bold leading-snug" style={{ color: pdfInk }}>
                {fn.code} — {fn.name}
              </h3>
              <p className="mt-1 text-[9pt] leading-snug" style={{ color: pdfMuted }}>
                Summary: {fn.totals.addressed}/{fn.totals.total} addressed · {fn.percentages.addressed}% addressed ·{" "}
                {fn.percentages.partiallyAddressed}% partial · {fn.percentages.notAddressed}% not addressed
              </p>
              <div className="mt-2 overflow-x-auto">
                <table
                  className="w-full min-w-[520px] border-collapse border text-[8pt]"
                  style={{ borderColor: pdfLine }}
                >
                  <thead>
                    <tr
                      className="text-left font-bold text-white"
                      style={{ backgroundColor: `rgb(${pdfTableHead.join(" ")})` }}
                    >
                      <th className="border px-1.5 py-1.5 align-top" style={{ borderColor: pdfLine }}>
                        Code
                      </th>
                      <th className="border px-1.5 py-1.5 align-top" style={{ borderColor: pdfLine }}>
                        Control area
                      </th>
                      <th className="border px-1.5 py-1.5 text-right align-top" style={{ borderColor: pdfLine }}>
                        Total
                      </th>
                      <th className="border px-1.5 py-1.5 text-right align-top" style={{ borderColor: pdfLine }}>
                        Addr
                      </th>
                      <th className="border px-1.5 py-1.5 text-right align-top" style={{ borderColor: pdfLine }}>
                        Part
                      </th>
                      <th className="border px-1.5 py-1.5 text-right align-top" style={{ borderColor: pdfLine }}>
                        Open
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(fn.controlAreas ?? []).map((row) => (
                      <tr key={row.code}>
                        <td className="border px-1.5 py-1.5 align-top" style={{ borderColor: pdfLine, color: pdfBody }}>
                          {row.code}
                        </td>
                        <td className="border px-1.5 py-1.5 align-top leading-snug" style={{ borderColor: pdfLine }}>
                          {row.name}
                        </td>
                        <td
                          className="border px-1.5 py-1.5 text-right tabular-nums align-top"
                          style={{ borderColor: pdfLine }}
                        >
                          {row.total}
                        </td>
                        <td
                          className="border px-1.5 py-1.5 text-right tabular-nums align-top"
                          style={{ borderColor: pdfLine }}
                        >
                          {row.addressed}
                        </td>
                        <td
                          className="border px-1.5 py-1.5 text-right tabular-nums align-top"
                          style={{ borderColor: pdfLine }}
                        >
                          {row.partiallyAddressed}
                        </td>
                        <td
                          className="border px-1.5 py-1.5 text-right tabular-nums align-top"
                          style={{ borderColor: pdfLine }}
                        >
                          {row.notAddressed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {certificate != null ? (
        <section className="mt-8">
          <h2 className="text-[12pt] font-bold" style={{ color: pdfInk }}>
            Certificate data
          </h2>
          <pre
            className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap wrap-break-word rounded border p-3 text-[7pt] leading-snug font-mono"
            style={{ borderColor: pdfLine, color: "#3c3c3c", backgroundColor: "#fafafa" }}
          >
            {typeof certificate === "string" ? certificate : JSON.stringify(certificate, null, 2)}
          </pre>
        </section>
      ) : null}
    </article>
  )
}
