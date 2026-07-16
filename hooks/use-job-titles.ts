"use client"

import { useEffect, useState } from "react"
import type { JobTitle } from "@/lib/types/job-title"

let cache: JobTitle[] | null = null

export function useJobTitles() {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>(cache ?? [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) {
      setJobTitles(cache)
      setLoading(false)
      return
    }
    fetch("/job-titles.json")
      .then((res) => res.json())
      .then((data: JobTitle[]) => {
        cache = data
        setJobTitles(data)
      })
      .catch(() => setJobTitles([]))
      .finally(() => setLoading(false))
  }, [])

  return { jobTitles, loading }
}
