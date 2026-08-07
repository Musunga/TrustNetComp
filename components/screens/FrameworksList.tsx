"use client"

import Link from "next/link"
import { useFrameworksCatalog } from "@/hooks/use-frameworks-catalog"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import SelectFrameworkButton from "../shared/SelectFrameworkButton"
import { AlertCircle, Eye, RefreshCw } from "lucide-react"

const FrameworksList = () => {
  const { data: frameworks, isLoading: loading, error, mutate } = useFrameworksCatalog()

  if (loading) {
    return (
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Compliance Frameworks</CardTitle>
          <CardDescription>Available frameworks for your next assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 rounded-lg border bg-accent/5 p-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-8 w-16 shrink-0 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Compliance Frameworks</CardTitle>
        <CardDescription>Available frameworks for your next assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10 text-center">
            <AlertCircle className="h-8 w-8 text-destructive/70" />
            <div>
              <p className="text-sm font-medium">Couldn&apos;t load frameworks</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Something went wrong on our end.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => mutate()}>
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        ) : frameworks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No frameworks available.</p>
        ) : (
          frameworks.map((fw) => (
            <div
              key={String(fw.id)}
              className="flex items-center justify-between gap-4 rounded-lg border bg-accent/5 p-3"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium">{fw.name}</p>
                {fw.description && (
                  <p className="text-xs text-muted-foreground">{fw.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/assessments/preview/${fw.id}`}>
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Preview
                  </Link>
                </Button>
                <SelectFrameworkButton framework={fw} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default FrameworksList