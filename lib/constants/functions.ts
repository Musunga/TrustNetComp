export function formatDate(d: Date | string): string {
    const date = typeof d === "string" ? new Date(d) : d
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }
  

 export function parseProgress(progress: string): number {
    if (typeof progress !== "string") return 0
    const num = parseInt(progress.replace(/%/g, "").trim(), 10)
    return Number.isNaN(num) ? 0 : Math.min(100, Math.max(0, num))
  }
  
  export function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "warning" | "bg-gray-300"   {
    const s = status?.toUpperCase() ?? ""
    if (s === "COMPLETED" || s === "DONE") return "default"
    if (s === "IN_PROGRESS" || s === "IN PROGRESS") return "warning"
    if (s === "ACTIVE") return "secondary"
    if (s === "OVERDUE" || s === "FAILED") return "destructive"
    return "outline"
  }

export function complianceStatusVariant(
  code: string
): "default" | "secondary" | "destructive" | "success" | "outline" | "warning" {
  const c = (code ?? "").toUpperCase().replace(/-/g, "_").replace(/\s+/g, "_")
  if (c === "COMPLIANT" || c === "FULLY_COMPLIANT") return "success"
  if (c === "IN_PROGRESS") return "warning"
  if (c === "PARTIAL") return "secondary"
  if (c === "NOT_COMPLIANT" || c === "NON_COMPLIANT") return "destructive"
  return "outline"
}
