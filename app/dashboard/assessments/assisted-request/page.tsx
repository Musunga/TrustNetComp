"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Clock, Users, ShieldCheck } from "lucide-react"

export default function AssistedRequestPage() {
  const [submitted, setSubmitted] = React.useState(false)

  if (submitted) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-2xl text-center space-y-6 pt-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Request Sent Successfully</h2>
            <p className="text-muted-foreground">
              Our technical team has received your assessment request. You will receive an email confirmation shortly
              with further instructions.
            </p>
          </div>
          <Button asChild>
            <a href="/dashboard">Return to Dashboard</a>
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assisted Assessment Request</h2>
          <p className="text-muted-foreground">
            Our technical team will guide you through the compliance process and execute the assessment.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tell us about your needs</CardTitle>
              <CardDescription>
                Provide details about your company and the compliance goals you want to achieve.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="framework">Compliance Framework</Label>
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                  ISO 27001 (Information Security Management)
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message to Technical Team</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your organization size, current security posture, and preferred timeline..."
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Estimated Timeline</p>
                    <p className="text-xs text-muted-foreground">2-4 weeks depending on readiness</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Dedicated Expert</p>
                    <p className="text-xs text-muted-foreground">Assigned technical member for guidance</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t pt-6 mt-6 sm:flex-row sm:justify-between sm:items-center">
              <div className="text-sm">
                <p className="font-semibold text-primary">Cost: $499.00</p>
                <p className="text-muted-foreground">One-time assessment fee</p>
              </div>
              <Button onClick={() => setSubmitted(true)} className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
