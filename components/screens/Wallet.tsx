"use client"

import { useEffect, useState } from "react"
import { CreditCard, Plus, ReceiptText, Tags } from "lucide-react"
import { useAtomValue } from "jotai"
import { activeCompanyAtom } from "@/lib/store/auth"
import { fetchCompanyWallet } from "@/lib/actions/wallet"
import { formatCreditBalance, formatDate, formatZmwAmount, getWalletCreditBalance } from "@/lib/constants/functions"
import type { CompanyWalletResponse, WalletCreditPackage, WalletTransaction } from "@/lib/types/wallet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const recentTransactions: WalletTransaction[] = []

const creditPackages: WalletCreditPackage[] = [
  {
    id: "starter",
    name: "Starter Credits",
    credits: 10,
    description: "Best for a small assessment cycle.",
  },
  {
    id: "growth",
    name: "Growth Credits",
    credits: 50,
    description: "For teams running multiple compliance workflows.",
  },
  {
    id: "enterprise",
    name: "Enterprise Credits",
    credits: 100,
    description: "For larger programs and recurring technical review.",
  },
]

export default function Wallet() {
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [wallet, setWallet] = useState<CompanyWalletResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!activeCompany?.id) {
      setWallet(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(false)
    fetchCompanyWallet(activeCompany.id)
      .then(setWallet)
      .catch(() => {
        setWallet(null)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [activeCompany?.id])

  const balance = getWalletCreditBalance(wallet)
  const creditRate = wallet?.zmwPerCredit ?? null

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
          <p className="text-muted-foreground">
            Manage your company credits, recent transactions, and pricing.
          </p>
        </div>
        <Button disabled={!activeCompany?.id}>
          <Plus className="mr-2 h-4 w-4" />
          Top up credit
        </Button>
      </div>

      <Card className="overflow-hidden border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-50">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardDescription className="text-blue-700 dark:text-blue-300">Available Credit Balance</CardDescription>
            <CardTitle className="mt-2 text-4xl">
              {loading ? (
                <Skeleton className="h-10 w-48 bg-blue-200 dark:bg-blue-900/70" />
              ) : (
                `${formatCreditBalance(balance)} credits`
              )}
            </CardTitle>
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/70">
            <CreditCard className="h-6 w-6 text-blue-700 dark:text-blue-200" />
          </span>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-blue-700 dark:text-blue-300 sm:grid-cols-3">
          <div>
            <p className="font-medium text-blue-950 dark:text-blue-50">{activeCompany?.name ?? "No company selected"}</p>
            <p>Company wallet</p>
          </div>
          <div>
            {loading ? (
              <Skeleton className="mb-1 h-5 w-28 bg-blue-200 dark:bg-blue-900/70" />
            ) : (
              <p className="font-medium text-blue-950 dark:text-blue-50">{formatZmwAmount(wallet?.balanceZmwEquivalent)}</p>
            )}
            <p>ZMW equivalent</p>
          </div>
          <div>
            {loading ? (
              <Skeleton className="mb-1 h-5 w-36 bg-blue-200 dark:bg-blue-900/70" />
            ) : (
              <p className="font-medium text-blue-950 dark:text-blue-50">
                {creditRate === null ? "—" : `${formatZmwAmount(creditRate)} per credit`}
              </p>
            )}
            {loading ? (
              <Skeleton className="h-4 w-32 bg-blue-200 dark:bg-blue-900/70" />
            ) : (
              <p>{wallet?.updatedAt ? `Updated ${formatDate(wallet.updatedAt)}` : "Current credit rate"}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Could not load wallet balance. Please try again.
        </div>
      )}

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="pricing">Features & Prices</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ReceiptText className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Top-ups and credit usage will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <ReceiptText className="mb-3 h-10 w-10 text-muted-foreground/60" />
                  <p className="text-sm font-medium text-muted-foreground">No transactions yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Recent wallet activity will be listed here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{transaction.credits} credits</p>
                        <Badge variant={transaction.status === "Completed" ? "success" : "outline"}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {creditPackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{pkg.credits} credits</p>
                    <p className="text-sm text-muted-foreground">
                      {creditRate === null ? "Pricing unavailable" : formatZmwAmount(pkg.credits * creditRate)}
                    </p>
                  </div>
                  <Button className="w-full" variant={pkg.id === "growth" ? "default" : "outline"}>
                    <Tags className="mr-2 h-4 w-4" />
                    Top up package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
