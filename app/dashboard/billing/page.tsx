import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, CreditCard } from "lucide-react"

export default function BillingPage() {
  const plans = [
    {
      name: "Standard",
      price: "$299",
      description: "Basic compliance management for small teams.",
      features: ["Self-Service assessments", "Up to 5 team members", "Standard report generation", "Email support"],
      current: true,
    },
    {
      name: "Enterprise",
      price: "$999",
      description: "Full compliance suite with professional assistance.",
      features: [
        "Everything in Standard",
        "Unlimited team members",
        "Assisted Assessment support",
        "Priority technical review",
        "Compliance certificates included",
      ],
      current: false,
    },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscription & Billing</h2>
          <p className="text-muted-foreground">Manage your company's subscription and compliance certificates.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.current ? "border-primary shadow-md" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.current && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Current Plan
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.current ? "outline" : "default"}>
                  {plan.current ? "Manage Plan" : "Upgrade Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View your recent transactions and download invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2026-01-01", amount: "$299.00", status: "Paid", item: "Annual Subscription" },
                { date: "2025-12-15", amount: "$150.00", status: "Paid", item: "Assisted Assessment Fee" },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.item}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{tx.amount}</p>
                    <p className="text-xs text-green-600 font-medium">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
