import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertCircle, User, MoreHorizontal, Filter, ArrowUpRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TasksPage() {
  const tasks = [
    {
      id: "TSK-001",
      title: "Information Security Policy",
      control: "A.5.1.1",
      assignedTo: "Jane Smith",
      status: "In Progress",
      priority: "High",
      dueDate: "2 days left",
    },
    {
      id: "TSK-002",
      title: "Inventory of Assets",
      control: "A.8.1.1",
      assignedTo: "Robert Wilson",
      status: "Pending",
      priority: "Medium",
      dueDate: "5 days left",
    },
    {
      id: "TSK-003",
      title: "Acceptable Use of Assets",
      control: "A.8.1.3",
      assignedTo: "Unassigned",
      status: "Todo",
      priority: "Low",
      dueDate: "1 week left",
    },
    {
      id: "TSK-004",
      title: "Access Control Policy",
      control: "A.9.1.1",
      assignedTo: "John Doe",
      status: "Completed",
      priority: "High",
      dueDate: "Completed",
    },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Compliance Tasks</h2>
            <p className="text-muted-foreground">Manage and track control implementation for ISO 27001.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              Submit for Review
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>System generated controls based on ISO 27001 framework.</CardDescription>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">45%</span>
                <p className="text-xs text-muted-foreground">9 of 20 tasks completed</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={45} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {task.control}
                        </Badge>
                        <h3 className="font-semibold leading-none">{task.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Implement and maintain a policy for information security...
                      </p>
                    </div>
                    <Badge
                      variant={task.status === "Completed" ? "default" : "secondary"}
                      className={
                        task.status === "In Progress" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none" : ""
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-xs">
                        <p className="text-muted-foreground">Assigned to</p>
                        <p className="font-medium">{task.assignedTo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-xs">
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{task.dueDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          task.priority === "High" ? "bg-red-50 text-red-600" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="text-muted-foreground">Priority</p>
                        <p className="font-medium">{task.priority}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t px-6 py-4 md:border-l md:border-t-0">
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Assign Member</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                      <DropdownMenuItem>Add Evidence</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
