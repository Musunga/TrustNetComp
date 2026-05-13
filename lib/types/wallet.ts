export interface CompanyWalletResponse {
  walletId: string
  companyId: string
  balance: number
  zmwPerCredit: number
  balanceZmwEquivalent: number
  updatedAt: string
}

/** Normalized row from wallet transaction APIs (many field names consolidated in lib/utils/wallet-transactions). */
export interface WalletLedgerTransaction {
  id: string
  createdAt: string | null
  description: string
  direction: string | null
  amountCredits: number | null
  amountZmw: number | null
  status: string | null
  balanceAfterCredits: number | null
}

export interface WalletTransactionsPage {
  items: WalletLedgerTransaction[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface WalletFeaturePricing {
  id: string
  featureCode: string
  featureName: string
  creditCost: number
  isFree: boolean
  isActive: boolean
  updatedById: string | null
  createdAt: string
  updatedAt: string
}

export interface WalletMobileMoneyLoadBody {
  amountZmw: number
  phoneNumber: string
}

/** Normalized POST /wallet/:id/load/mobile-money response (API may wrap or use varying field names). */
export interface WalletMobileMoneyLoadResult {
  ok: boolean
  message: string | null
  transactionId: string | null
  reference: string | null
  externalUrl: string | null
  statusCode: string | null
  estimatedCredits: number | null
  extras: Record<string, unknown>
}
