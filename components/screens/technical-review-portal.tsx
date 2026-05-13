"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AssistedAssessmentReviewQueueTable } from "@/components/screens/assisted-assessment-review-queue-table"

export default function TechnicalReviewPortal() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Technical Review Portal</h2>
        <p className="text-muted-foreground">
          Review assisted assessment submissions across companies and frameworks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assisted assessment queue</CardTitle>
          <CardDescription>
            Requests awaiting review. Start assessment selects the framework for the company and opens the
            assessment by id (controls and overview).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssistedAssessmentReviewQueueTable />
        </CardContent>
      </Card>
    </div>
  )
}
