"use client"

import type { AssessmentFunction } from "@/lib/types/assessment-detail"
import { getFunctionControlsCompletionCounts } from "@/lib/constants/functions"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronRight } from "lucide-react"

export interface ControlFunctionsListProps {
  functions: AssessmentFunction[]
  onSelectFunction: (fn: AssessmentFunction) => void
}

export function ControlFunctionsList({ functions, onSelectFunction }: ControlFunctionsListProps) {
  if (!functions?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground">
        No functions available.
      </div>
    )
  }

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 w-24 py-2 text-xs font-medium text-muted-foreground">Code</TableHead>
            <TableHead className="h-8 py-2 text-xs font-medium text-muted-foreground">Name</TableHead>
            <TableHead className="h-8 min-w-20 whitespace-nowrap py-2 text-right text-xs font-medium text-muted-foreground">
              Completed / Total
            </TableHead>
            <TableHead className="h-8 w-[1%] py-2 text-right text-xs font-medium text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {functions.map((fn) => {
            const { completed, total } = getFunctionControlsCompletionCounts(fn)
            const isComplete = total > 0 && completed === total
            return (
              <TableRow
                key={fn.id}
                className={cn(
                  "cursor-pointer",
                  isComplete &&
                    "border-primary/20 bg-primary/5 hover:bg-primary/8 md:border-l-4 md:border-l-primary"
                )}
                onClick={() => onSelectFunction(fn)}
                aria-label={
                  isComplete
                    ? `${fn.name} complete, ${completed} of ${total} controls completed`
                    : `${fn.name}, ${completed} of ${total} controls completed`
                }
              >
                <TableCell className="py-2 font-mono text-xs text-muted-foreground">
                  {fn.code}
                </TableCell>
                <TableCell className="py-2 text-sm font-medium">{fn.name}</TableCell>
                <TableCell className="py-2 text-right align-middle">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span
                      className={cn(
                        "tabular-nums text-xs",
                        isComplete
                          ? "font-semibold text-emerald-700 dark:text-emerald-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {completed}/{total}
                    </span>
                    {isComplete ? (
                      <Badge variant="success" className="h-5 shrink-0 px-1.5 text-[10px] font-medium">
                        Complete
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="py-2 pr-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectFunction(fn)
                    }}
                    aria-label={`Open ${fn.name}`}
                  >
                    View
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
