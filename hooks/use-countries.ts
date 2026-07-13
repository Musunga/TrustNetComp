"use client"

import { useEffect, useState } from "react"
import type { Country } from "@/lib/types/country"

let cache: Country[] | null = null

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(cache ?? [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) {
      setCountries(cache)
      setLoading(false)
      return
    }
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data: Country[]) => {
        cache = data
        setCountries(data)
      })
      .catch(() => setCountries([]))
      .finally(() => setLoading(false))
  }, [])

  return { countries, loading }
}
