"use client"

import type { AssessmentFunction } from "@/lib/types/assessment-detail"
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
            <TableHead className="h-8 w-24 py-2 text-right text-xs font-medium text-muted-foreground">
              Controls
            </TableHead>
            <TableHead className="h-8 w-[1%] py-2 text-right text-xs font-medium text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {functions.map((fn) => {
            const controlCount =
              fn.controlAreas?.reduce((s, ca) => s + (ca.controls?.length ?? 0), 0) ?? 0
            return (
              <TableRow
                key={fn.id}
                className="cursor-pointer"
                onClick={() => onSelectFunction(fn)}
              >
                <TableCell className="py-2 font-mono text-xs text-muted-foreground">
                  {fn.code}
                </TableCell>
                <TableCell className="py-2 text-sm font-medium">
                  {fn.name}
                </TableCell>
                <TableCell className="py-2 text-right text-xs tabular-nums text-muted-foreground">
                  {controlCount}
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
