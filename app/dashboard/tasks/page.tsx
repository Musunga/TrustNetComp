import { DashboardShell } from "@/components/dashboard-shell"
import TasksList from "@/components/screens/TasksList"

export default function TasksPage() {
  return (
    <DashboardShell>
      <TasksList />
    </DashboardShell>
  )
}
