"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Shield, Users, Info, ArrowRight, CheckCircle2, Zap } from "lucide-react"

export default function NewAssessmentPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [framework, setFramework] = React.useState("iso-27001")
  const [assessmentType, setAssessmentType] = React.useState("self-service")

  const frameworks = [
    {
      id: "boz",
      title: "Bank Of Zambia (BOZ CSF)",
      description: "Cybersecurity Framework for financial institutions in Zambia.",
    },
    {
      id: "iso-27001",
      title: "ISO 27001",
      description: "International standard for information security management systems.",
    },
    {
      id: "soc2",
      title: "SOC 2",
      description: "Security, Availability, Processing Integrity, Confidentiality, and Privacy controls.",
    },
    {
      id: "zdpa",
      title: "Zambia Data Protection",
      description: "Compliance with the Data Protection Act No. 3 of 2021.",
    },
    {
      id: "pci-dss",
      title: "PCI DSS",
      description: "Payment Card Industry Data Security Standard for handling cardholder data.",
    },
  ]

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Redirect based on choice
      if (assessmentType === "self-service") {
        router.push("/dashboard/tasks")
      } else {
        router.push("/dashboard/assessments/assisted-request")
      }
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Start New Assessment</h2>
          <p className="text-muted-foreground">Follow the steps to configure your company's compliance module.</p>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              1
            </span>
            <span className={step === 1 ? "text-foreground" : "text-muted-foreground"}>Framework Selection</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              2
            </span>
            <span className={step === 2 ? "text-foreground" : "text-muted-foreground"}>Assessment Type</span>
          </div>
        </div>

        {step === 1 ? (
          <div className="grid gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Select Compliance Framework</CardTitle>
                <CardDescription>Choose the standard you want to be assessed against.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={framework} onValueChange={setFramework} className="grid gap-4">
                  {frameworks.map((fw) => (
                    <Label
                      key={fw.id}
                      htmlFor={fw.id}
                      className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors ${framework === fw.id ? "border-primary bg-primary/5" : ""}`}
                    >
                      <RadioGroupItem value={fw.id} id={fw.id} className="mt-1" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-bold">{fw.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{fw.description}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNext}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Choose Assessment Method</CardTitle>
                <CardDescription>Select how you want to complete the compliance assessment.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={assessmentType} onValueChange={setAssessmentType} className="grid gap-4">
                  <Label
                    htmlFor="self-service"
                    className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors ${assessmentType === "self-service" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <RadioGroupItem value="self-service" id="self-service" className="mt-1" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">Self-Service</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        System generates controls and tasks for you. Your team manages the execution and completion.
                      </p>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          No additional cost
                        </li>
                        <li className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          Immediate start
                        </li>
                      </ul>
                    </div>
                  </Label>
                  <Label
                    htmlFor="assisted"
                    className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors ${assessmentType === "assisted" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <RadioGroupItem value="assisted" id="assisted" className="mt-1" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-bold">Assisted Assessment</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Request our Technical Team to guide you through the process and execute the assessment.
                      </p>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info className="h-3 w-3 text-blue-500" />
                          Comes at an additional cost
                        </li>
                        <li className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info className="h-3 w-3 text-blue-500" />
                          Subject to team availability
                        </li>
                      </ul>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleNext}>
                  {assessmentType === "self-service" ? "Generate Tasks" : "Request Assistance"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
