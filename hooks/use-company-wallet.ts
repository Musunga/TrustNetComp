"use client"

import useSWR from "swr"
import { fetchCompanyWallet } from "@/lib/actions/wallet"

export function useCompanyWallet(companyId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    companyId ? ["company-wallet", companyId] : null,
    ([, id]) => fetchCompanyWallet(id)
  )

  return { data: data ?? null, error, isLoading, mutate }
}
