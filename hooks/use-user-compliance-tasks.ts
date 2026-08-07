"use client"

import useSWR from "swr"
import { fetchUserComplianceTasks } from "@/lib/actions/compliance-progress"

export function useUserComplianceTasks(userId: string | null | undefined, companyId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    userId && companyId ? ["user-compliance-tasks", userId, companyId] : null,
    ([, uId, cId]) => fetchUserComplianceTasks(uId, cId)
  )

  return { data: data ?? null, error, isLoading, mutate }
}
