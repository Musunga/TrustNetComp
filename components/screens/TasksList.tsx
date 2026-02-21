"use client"

import { fetchUserComplianceTasks } from "@/lib/actions/compliance-progress"
import { patchComplianceProgress } from "@/lib/actions/frameworks"
import { activeCompanyAtom, authSessionAtom } from "@/lib/store/auth"
import type { UserComplianceTask } from "@/lib/types/user-compliance-tasks"
import { formatDate, complianceStatusVariant } from "@/lib/constants/functions"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Filter, CheckSquare, PenLine, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ControlStatusSheet } from "@/components/shared/ControlStatusSheet"

function TaskCard({
  task,
  onUpdateStatus,
}: {
  task: UserComplianceTask
  onUpdateStatus: (task: UserComplianceTask) => void
}) {
  const statusVariant = complianceStatusVariant(task.status.code)
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">
                  {task.control.code}
                </Badge>
                <h3 className="font-semibold leading-tight">{task.control.question}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {task.framework.name} · {task.function.name} · {task.controlArea.name}
              </p>
            </div>
            <Badge variant={statusVariant} className="shrink-0 text-xs">
              {task.status.name}
            </Badge>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs">
                <p className="text-muted-foreground">Updated</p>
                <p className="font-medium">{formatDate(task.updatedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs">
                <p className="text-muted-foreground">Completion</p>
                <p className="font-medium">{task.completionPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t px-6 py-4 md:border-l md:border-t-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent md:w-auto"
            onClick={() => onUpdateStatus(task)}
          >
            <PenLine className="mr-2 h-4 w-4" />
            Update status
          </Button>
        </div>
      </div>
    </Card>
  )
}

function TasksListSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-1 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-4 w-full max-w-md" />
              <div className="flex gap-6 pt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="border-t px-6 py-4 md:border-l md:border-t-0">
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function TasksList() {
  const authSession = useAtomValue(authSessionAtom)
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchUserComplianceTasks>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedTask, setSelectedTask] = useState<UserComplianceTask | null>(null)

  const userId = authSession?.user?.id
  const companyId = activeCompany?.id ?? ""

  function refetchTasks() {
    if (!userId || !companyId) return
    return fetchUserComplianceTasks(userId, companyId)
      .then(setData)
      .catch(() => setError(true))
  }

  useEffect(() => {
    if (!userId || !companyId) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    fetchUserComplianceTasks(userId, companyId)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [userId, companyId])

  const tasks = data?.tasks ?? []
  const totalTasks = data?.totalTasks ?? 0
  const completedCount = tasks.filter((t) => t.completionPercentage >= 100).length
  const overallPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Compliance Tasks</h2>
          <p className="text-muted-foreground">
            Tasks assigned to you for the selected company.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {loading && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>
          <TasksListSkeleton />
        </>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-destructive">Failed to load tasks.</p>
            <p className="mt-1 text-xs text-muted-foreground">Try again or select a company.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (!userId || !companyId) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-10 w-10 text-muted-foreground/60" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">Select a company to see your tasks.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && userId && companyId && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <CardTitle>Overall Progress</CardTitle>
                  <CardDescription>Tasks assigned to you for this company.</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{overallPercent}%</span>
                  <p className="text-xs text-muted-foreground">
                    {completedCount} of {totalTasks} tasks completed
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallPercent} className="h-2" />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckSquare className="h-10 w-10 text-muted-foreground/60" />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">No tasks assigned.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tasks for this company will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={setSelectedTask}
                />
              ))
            )}
          </div>

          <ControlStatusSheet
            open={!!selectedTask}
            onOpenChange={(open) => !open && setSelectedTask(null)}
            initialStatusCode={selectedTask?.status?.code ?? ""}
            initialComment={selectedTask?.assignedToComment ?? ""}
            code={selectedTask?.control?.code ?? ""}
            question={selectedTask?.control?.question ?? ""}
            onSave={async (payload) => {
              if (!selectedTask || !companyId) return
              await patchComplianceProgress(selectedTask.id, {
                companyId,
                statusCode: payload.statusCode,
                assignedToComment: payload.assignedToComment,
                attachedEvidence: payload.attachedEvidence,
              })
              setSelectedTask(null)
              await refetchTasks()
            }}
          />
        </>
      )}
    </div>
  )
}
