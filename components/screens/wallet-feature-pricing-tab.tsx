"use client"

import type { WalletFeaturePricing } from "@/lib/types/wallet"
import { formatZmwAmount } from "@/lib/constants/functions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export interface WalletFeaturePricingTabProps {
  zmwPerCredit: number | null
  loading: boolean
  error: boolean
  features: WalletFeaturePricing[]
}

export function WalletFeaturePricingTab({
  zmwPerCredit,
  loading,
  error,
  features,
}: WalletFeaturePricingTabProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="mt-2 h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Could not load feature pricing. Please try again.
      </div>
    )
  }

  if (!features.length) {
    return <p className="text-sm text-muted-foreground">No pricing is configured for wallet features yet.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <Card key={f.id}>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="text-lg leading-snug">{f.featureName}</CardTitle>
              {f.isFree ? (
                <Badge variant="secondary" className="shrink-0">
                  Free
                </Badge>
              ) : null}
            </div>
            <CardDescription className="font-mono text-xs">{f.featureCode}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {f.isFree ? (
                <p className="text-sm text-muted-foreground">Included at no credit cost.</p>
              ) : (
                <>
                  <p className="text-3xl font-bold">{f.creditCost} credits</p>
                  <p className="text-sm text-muted-foreground">
                    {zmwPerCredit === null || zmwPerCredit <= 0
                      ? "ZMW estimate unavailable"
                      : formatZmwAmount(f.creditCost * zmwPerCredit)}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
