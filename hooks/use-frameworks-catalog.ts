"use client"

import useSWR from "swr"
import { fetchAllFrameworks } from "@/lib/actions/frameworks"

export function useFrameworksCatalog() {
  const { data, error, isLoading, mutate } = useSWR("frameworks-catalog", fetchAllFrameworks)
  return { data: data ?? [], error, isLoading, mutate }
}
