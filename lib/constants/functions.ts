export function formatDate(d: Date | string): string {
    const date = typeof d === "string" ? new Date(d) : d
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }
  

 export function parseProgress(progress: string): number {
    if (typeof progress !== "string") return 0
    const num = parseInt(progress.replace(/%/g, "").trim(), 10)
    return Number.isNaN(num) ? 0 : Math.min(100, Math.max(0, num))
  }
  
  export function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    const s = status?.toUpperCase() ?? ""
    if (s === "COMPLETED" || s === "DONE") return "default"
    if (s === "IN_PROGRESS" || s === "IN PROGRESS" || s === "ACTIVE") return "secondary"
    if (s === "OVERDUE" || s === "FAILED") return "destructive"
    return "outline"
  }
  