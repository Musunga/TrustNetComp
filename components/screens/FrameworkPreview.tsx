"use client"

import React, { useEffect, useState } from "react"
import { fetchFrameworkPreview } from "@/lib/actions/frameworks"
import type {
  FrameworkPreviewResponse,
  FrameworkPreviewFunction,
  FrameworkPreviewControlArea,
} from "@/lib/types/framework-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield, AlertCircle, RefreshCw, ClipboardList, Calendar, ChevronDown, ArrowLeft } from "lucide-react"
import { useViewOrchestrator } from "@/hooks/use-pageView"
import { ViewDefinition, ViewOrchestrator } from "../shared/Pageview"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function PreviewFunctionsList({
  functions,
  onSelectFunction,
}: {
  functions: FrameworkPreviewFunction[]
  onSelectFunction: (fn: FrameworkPreviewFunction) => void
}) {
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
                <TableCell className="py-2 text-sm font-medium">{fn.name}</TableCell>
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

function PreviewFunctionSection({ fn }: { fn: FrameworkPreviewFunction }) {
  const areas = fn.controlAreas ?? []
  const hasControls = areas.some((a) => (a.controls?.length ?? 0) > 0)

  if (!hasControls) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No controls in this function.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 w-24 py-2 text-xs font-medium text-muted-foreground">Code</TableHead>
            <TableHead className="h-8 min-w-[280px] py-2 text-xs font-medium text-muted-foreground">
              Question
            </TableHead>
            <TableHead className="h-8 min-w-[180px] py-2 text-xs font-medium text-muted-foreground">
              Required evidence
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map((area: FrameworkPreviewControlArea) => (
            <React.Fragment key={area.id}>
              <TableRow className="bg-muted/40 hover:bg-transparent">
                <TableCell colSpan={3} className="py-2 font-medium text-foreground">
                  <span className="font-bold">{area.name}</span>
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                    {area.code}
                  </span>
                </TableCell>
              </TableRow>
              {(area.controls ?? []).map((control) => (
                <TableRow key={control.id}>
                  <TableCell className="py-2 font-mono text-xs text-muted-foreground">
                    {control.code}
                  </TableCell>
                  <TableCell className="min-w-[280px] max-w-[50%] py-2 text-sm">
                    <span className="whitespace-normal wrap-break-word">
                      {control.question}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-[180px] py-2 text-xs text-muted-foreground">
                    {control.requiredEvidence?.length
                      ? control.requiredEvidence.join(", ")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

type PreviewViews = "controlFunctions" | "functionDetail"

export default function FrameworkPreview({ id }: { id: string }) {
  const [framework, setFramework] = useState<FrameworkPreviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFunction, setSelectedFunction] = useState<FrameworkPreviewFunction | null>(null)
  const [cardOpen, setCardOpen] = useState(true)

  const { activeViewId, navigateTo, navigateBack, direction } =
    useViewOrchestrator<PreviewViews>("controlFunctions")

  function load() {
    setError(null)
    setLoading(true)
    fetchFrameworkPreview(id)
      .then(setFramework)
      .catch(() => setError("Failed to load framework preview."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-7 w-64" />
            </div>
            <Skeleton className="h-4 max-w-2xl" />
          </CardHeader>
        </Card>
        <div>
          <Skeleton className="mb-4 h-6 w-56" />
          <div className="rounded-lg border bg-muted/20 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="mb-2 h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !framework) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-center text-sm text-muted-foreground">
            {error ?? "Framework not found."}
          </p>
          <Button variant="outline" onClick={load} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalControls =
    framework.functions?.reduce(
      (sum, fn) =>
        sum + (fn.controlAreas?.reduce((s, ca) => s + (ca.controls?.length ?? 0), 0) ?? 0),
      0
    ) ?? 0

  const views: ViewDefinition<PreviewViews>[] = [
    {
      id: "controlFunctions",
      content: (
        <PreviewFunctionsList
          functions={framework.functions ?? []}
          onSelectFunction={(fn) => {
            setSelectedFunction(fn)
            navigateTo("functionDetail")
          }}
        />
      ),
    },
    {
      id: "functionDetail",
      content: selectedFunction ? (
        <div className="flex flex-col gap-4 p-4">
          <div className="sticky top-0 z-10 flex shrink-0 flex-col gap-2 border-b bg-background pb-2 pt-1 -mt-1">
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-2 font-bold"
              onClick={navigateBack}
              aria-label="Back to functions"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to functions
            </Button>
            <p className="font-bold text-xl text-muted-foreground">{selectedFunction.name}</p>
          </div>
          <PreviewFunctionSection fn={selectedFunction} />
        </div>
      ) : (
        <div className="p-4 text-sm text-muted-foreground">No function selected.</div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Collapsible open={cardOpen} onOpenChange={setCardOpen}>
        <Card>
          <CardHeader className="py-3">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Shield className="h-4 w-4 shrink-0 text-primary" />
                <CardTitle className="text-base font-semibold">
                  {framework.name}
                  <span className="ml-1 font-normal text-muted-foreground">
                    ({framework.code})
                  </span>
                </CardTitle>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Version {framework.version}
                  </span>
                  <span>Effective {formatDate(framework.effectiveDate)}</span>
                </span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${cardOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-3 pt-0">
              {framework.description && (
                <CardDescription className="text-xs">
                  {framework.description}
                </CardDescription>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          Controls by function
          {totalControls > 0 && (
            <span className="text-muted-foreground">({totalControls})</span>
          )}
        </h2>
        <ScrollArea className="h-[calc(100vh-20rem)] rounded-lg border bg-muted/20">
          <ViewOrchestrator
            views={views}
            activeViewId={activeViewId}
            direction={direction}
          />
        </ScrollArea>
      </div>
    </div>
  )
}
