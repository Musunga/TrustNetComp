"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { fetchAllFrameworks } from "@/lib/actions/frameworks"
import type { Framework } from "@/lib/types/framework"

export default function DashboardPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([])

  useEffect(() => {
    fetchAllFrameworks()
      .then(setFrameworks)
      .catch(() => setFrameworks([]))
  }, [])

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, Admin. Here is your company's compliance overview.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:divide-x divide-border">
          <div className="flex-1 py-4 md:py-2 md:pr-6">
            <div className="text-sm text-muted-foreground">Active Assessments</div>
            <div className="mt-1 text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">ISO 27001 Foundation</p>
          </div>
          <div className="flex-1 py-4 md:py-2 md:px-6">
            <div className="text-sm text-muted-foreground">Team Members</div>
            <div className="mt-1 text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
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
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest tasks and updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Task Completed</p>
                      <p className="text-sm text-muted-foreground">
                        User A completed the 'Access Control Policy' control.
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-muted-foreground">2h ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Compliance Frameworks</CardTitle>
              <CardDescription>Available frameworks for your next assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {frameworks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No frameworks available.</p>
              ) : (
                frameworks.map((fw) => (
                  <div key={String(fw.id)} className="flex items-center justify-between p-3 border rounded-lg bg-accent/5">
                    <div className="space-y-1">
                      <p className="font-medium">{fw.name}</p>
                      {fw.description && (
                        <p className="text-xs text-muted-foreground">{fw.description}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Select
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
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
