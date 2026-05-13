"use client"

import { useEffect, useState } from "react"
import { CreditCard, Plus, ReceiptText, Tags } from "lucide-react"
import { useAtomValue } from "jotai"
import { useRouter } from "next/navigation"
import { activeCompanyAtom, authSessionAtom } from "@/lib/store/auth"
import { fetchCompanyWallet, fetchWalletFeaturePricing } from "@/lib/actions/wallet"
import { authSessionIsTechnicalAdmin, formatCreditBalance, formatDate, formatZmwAmount, getWalletCreditBalance } from "@/lib/constants/functions"
import type { CompanyWalletResponse, WalletFeaturePricing } from "@/lib/types/wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletTransactionsTable } from "@/components/screens/wallet-transactions-table"
import { WalletFeaturePricingTab } from "@/components/screens/wallet-feature-pricing-tab"
import { WalletTopUpDialog } from "@/components/screens/wallet-top-up-dialog"

export default function Wallet() {
  const authSession = useAtomValue(authSessionAtom)
  const router = useRouter()
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [wallet, setWallet] = useState<CompanyWalletResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [featurePricing, setFeaturePricing] = useState<WalletFeaturePricing[]>([])
  const [featurePricingLoading, setFeaturePricingLoading] = useState(true)
  const [featurePricingError, setFeaturePricingError] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)

  useEffect(() => {
    if (authSessionIsTechnicalAdmin(authSession)) {
      router.replace("/dashboard")
    }
  }, [authSession, router])

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

  useEffect(() => {
    if (authSessionIsTechnicalAdmin(authSession)) {
      setFeaturePricingLoading(false)
      return
    }
    setFeaturePricingLoading(true)
    setFeaturePricingError(false)
    fetchWalletFeaturePricing()
      .then((items) =>
        setFeaturePricing(items.filter((item) => item.isActive)),
      )
      .catch(() => {
        setFeaturePricing([])
        setFeaturePricingError(true)
      })
      .finally(() => setFeaturePricingLoading(false))
  }, [authSession])

  const balance = getWalletCreditBalance(wallet)
  const creditRate = wallet?.zmwPerCredit ?? null

  if (authSessionIsTechnicalAdmin(authSession)) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-sm text-muted-foreground">Redirecting…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
          <p className="text-muted-foreground">
            Manage your company credits, recent transactions, and pricing.
          </p>
        </div>
        <Button disabled={!activeCompany?.id} onClick={() => setTopUpOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Top up credit
        </Button>
      </div>

      <WalletTopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        companyId={activeCompany?.id}
        zmwPerCredit={creditRate}
        onWalletReload={async () => {
          if (!activeCompany?.id) return
          try {
            const next = await fetchCompanyWallet(activeCompany.id)
            setWallet(next)
          } catch {
            /* balance refresh best-effort */
          }
        }}
      />

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
              <WalletTransactionsTable companyId={activeCompany?.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" />
                Features &amp; Prices
              </CardTitle>
              <CardDescription>Credit cost per workflow deducted from your company wallet.</CardDescription>
            </CardHeader>
            <CardContent>
              <WalletFeaturePricingTab
                zmwPerCredit={creditRate}
                loading={featurePricingLoading}
                error={featurePricingError}
                features={featurePricing}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
