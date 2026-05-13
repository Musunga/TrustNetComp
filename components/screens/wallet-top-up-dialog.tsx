"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useAtomValue } from "jotai"
import { Loader2 } from "lucide-react"
import { authSessionAtom } from "@/lib/store/auth"
import { postWalletMobileMoneyLoad } from "@/lib/actions/wallet"
import type { WalletMobileMoneyLoadResult } from "@/lib/types/wallet"
import { formatZmwAmount } from "@/lib/constants/functions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

function normalizePhoneDigits(value: string): string {
  return value.replace(/\s+/g, "").trim()
}

function isValidMobileMoneyAmount(value: string): number | null {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100) / 100
}

export interface WalletTopUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string | undefined | null
  /** Used to estimate credits purchased at current rate */
  zmwPerCredit?: number | null
  /** Called after a successful initiation so balances can refresh */
  onWalletReload?: () => void | Promise<void>
}

export function WalletTopUpDialog({
  open,
  onOpenChange,
  companyId,
  zmwPerCredit,
  onWalletReload,
}: WalletTopUpDialogProps) {
  const authSession = useAtomValue(authSessionAtom)
  const savedPhone = (authSession?.user?.phoneNumber ?? "").trim()

  const [useMyNumber, setUseMyNumber] = useState(!!savedPhone)
  const [phoneManual, setPhoneManual] = useState("")
  const [amountZmw, setAmountZmw] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [result, setResult] = useState<WalletMobileMoneyLoadResult | null>(null)

  useEffect(() => {
    if (!open) return
    setFormError(null)
    setResult(null)
    setSubmitting(false)
    setAmountZmw("")
    setUseMyNumber(!!savedPhone)
    if (!savedPhone) setPhoneManual("")
  }, [open, savedPhone])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    if (!companyId) {
      setFormError("Select a company first.")
      return
    }
    const phone = useMyNumber ? normalizePhoneDigits(savedPhone) : normalizePhoneDigits(phoneManual)
    if (!phone || phone.length < 9) {
      setFormError("Enter a valid phone number.")
      return
    }
    const amount = isValidMobileMoneyAmount(amountZmw.trim())
    if (amount === null) {
      setFormError("Enter an amount greater than zero (ZMW).")
      return
    }

    setSubmitting(true)
    try {
      const res = await postWalletMobileMoneyLoad(companyId, { amountZmw: amount, phoneNumber: phone })
      setResult(res)
      if (res.ok && onWalletReload) {
        await onWalletReload()
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose(openNext: boolean) {
    if (!openNext) {
      setResult(null)
      setFormError(null)
    }
    onOpenChange(openNext)
  }

  const creditsHint =
    zmwPerCredit && zmwPerCredit > 0 && isValidMobileMoneyAmount(amountZmw.trim()) !== null
      ? `${(isValidMobileMoneyAmount(amountZmw.trim())! / zmwPerCredit).toFixed(2)} credits (estimate)`
      : null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top up with mobile money</DialogTitle>
          <DialogDescription>
            Pay in ZMW from a mobile-money wallet linked to your phone. You will confirm the prompt on your device if
            the provider requires it.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-4">
            <div
              className={
                result.ok
                  ? "rounded-md border border-green-600/25 bg-green-600/10 px-3 py-3 text-sm"
                  : "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive"
              }
              role="status"
            >
              <p className="font-medium">{result.ok ? "Request sent" : "Could not start top-up"}</p>
              {result.message ? <p className="mt-1 text-muted-foreground">{result.message}</p> : null}
            </div>
            {(result.reference || result.transactionId || result.statusCode) && (
              <dl className="grid gap-2 text-xs text-muted-foreground">
                {result.reference ? (
                  <div className="flex justify-between gap-2">
                    <dt>Reference</dt>
                    <dd className="font-mono text-foreground">{result.reference}</dd>
                  </div>
                ) : null}
                {result.transactionId ? (
                  <div className="flex justify-between gap-2">
                    <dt>Transaction</dt>
                    <dd className="font-mono text-foreground">{result.transactionId}</dd>
                  </div>
                ) : null}
                {result.statusCode ? (
                  <div className="flex justify-between gap-2">
                    <dt>Status</dt>
                    <dd className="text-foreground">{result.statusCode}</dd>
                  </div>
                ) : null}
                {typeof result.estimatedCredits === "number" ? (
                  <div className="flex justify-between gap-2">
                    <dt>Estimated credits</dt>
                    <dd className="text-foreground">{result.estimatedCredits}</dd>
                  </div>
                ) : null}
              </dl>
            )}
            {result.externalUrl ? (
              <Button asChild className="w-full">
                <a href={result.externalUrl} target="_blank" rel="noopener noreferrer">
                  Open payment page
                </a>
              </Button>
            ) : null}
            <DialogFooter className="sm:justify-stretch gap-2">
              {!result.ok ? (
                <Button type="button" variant="outline" onClick={() => setResult(null)}>
                  Try again
                </Button>
              ) : null}
              <Button type="button" onClick={() => handleClose(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!savedPhone ? (
              <p className="text-sm text-muted-foreground">
                No phone number is saved on your profile. Enter one below before sending the payment request.
              </p>
            ) : (
              <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="use-my-phone" className="text-sm font-medium">
                    Use my phone number
                  </Label>
                  <p className="text-xs text-muted-foreground">Uses the number on your account.</p>
                </div>
                <Switch id="use-my-phone" checked={useMyNumber} onCheckedChange={setUseMyNumber} />
              </div>
            )}

            {useMyNumber && savedPhone ? (
              <div className="space-y-2">
                <Label>Phone number</Label>
                <Input value={savedPhone} disabled readOnly className="bg-muted/50" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="wallet-mm-phone">Phone number</Label>
                <Input
                  id="wallet-mm-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+260971234567 or 0971234567"
                  value={phoneManual}
                  onChange={(e) => setPhoneManual(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="wallet-mm-amount">Amount (ZMW)</Label>
              <Input
                id="wallet-mm-amount"
                type="number"
                inputMode="decimal"
                step="1"
                min="1"
                placeholder="500"
                value={amountZmw}
                onChange={(e) => setAmountZmw(e.target.value)}
              />
              {creditsHint ? <p className="text-xs text-muted-foreground">{creditsHint}</p> : null}
            </div>

            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !companyId}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Continue
                    {isValidMobileMoneyAmount(amountZmw.trim()) !== null
                      ? ` — ${formatZmwAmount(isValidMobileMoneyAmount(amountZmw.trim())!)}`
                      : null}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
