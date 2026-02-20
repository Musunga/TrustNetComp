"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import FrameworksList from "@/components/screens/FrameworksList"
import RecentActivity from "@/components/screens/RecentActivity"
import CompanySelector from "@/components/screens/CompanySelector"
import MemberBreakdown from "@/components/screens/MemberBreakdown"



export default function DashboardPage() {

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, Admin. Here is your company's compliance overview.</p>
          </div>
          <CompanySelector />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:divide-x divide-border">
          <div className="flex-1 py-4 md:py-2 md:pr-6">
            <div className="text-sm text-muted-foreground">Active Assessments</div>
            <div className="mt-1 text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">ISO 27001 Foundation</p>
          </div>
          <div className="flex-1 py-4 md:py-2 md:px-6">
             <MemberBreakdown />
          </div>
          <div className="flex-1 py-4 md:py-2 md:px-6">
            <div className="text-sm text-muted-foreground">Pending Tasks</div>
            <div className="mt-1 text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </div>
          <div className="flex-1 py-4 md:py-2 md:pl-6">
            <div className="text-sm text-muted-foreground">Completion Rate</div>
            <div className="mt-2">
              <CircularProgress value={45} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentActivity />
          <FrameworksList />
        </div>
      </div>
    </DashboardShell>
  )
}

function CircularProgress({
  value,
  size = 80,
  strokeWidth = 8,
}: {
  value: number
  size?: number
  strokeWidth?: number
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - clamped / 100)

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      aria-label="Completion rate"
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-secondary"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-primary"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{clamped}%</span>
      </div>
    </div>
  )
}
