"use client"

import useSWR from "swr"
import { fetchCompanyAssessments } from "@/lib/actions/frameworks"

export function useCompanyAssessments(companyId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    companyId ? ["company-assessments", companyId] : null,
    ([, id]) => fetchCompanyAssessments(id)
  )

  return { data: data ?? [], error, isLoading, mutate }
}
