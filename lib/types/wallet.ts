export interface CompanyWalletResponse {
  walletId: string
  companyId: string
  balance: number
  zmwPerCredit: number
  balanceZmwEquivalent: number
  updatedAt: string
}

export interface WalletTransaction {
  id: string
  description: string
  date: string
  credits: number
  amountZmw: number
  status: "Completed" | "Pending" | "Failed"
}

export interface WalletCreditPackage {
  id: string
  name: string
  credits: number
  description: string
}
