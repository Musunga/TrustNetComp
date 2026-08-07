"use client"

import useSWR from "swr"
import { fetchCompanyMembersStats } from "@/lib/actions/companies"

export function useCompanyMembersStats(companyId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    companyId ? ["company-members-stats", companyId] : null,
    ([, id]) => fetchCompanyMembersStats(id)
  )

  return { data: data ?? null, error, isLoading, mutate }
}
