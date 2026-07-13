"use client"

import Link from "next/link"
import { fetchAllFrameworks } from "@/lib/actions/frameworks"
import { Framework } from "@/lib/types"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import SelectFrameworkButton from "../shared/SelectFrameworkButton"
import { Eye } from "lucide-react"

const FrameworksList = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllFrameworks()
      .then((data) => setFrameworks(data))
      .catch(() => setFrameworks([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="col-span-3">
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