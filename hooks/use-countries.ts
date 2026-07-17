"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { API_ROUTES } from "@/lib/constants/api-routes"
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
    api
      .get<Country[]>(API_ROUTES.LOCATIONS.COUNTRIES)
      .then(({ data }) => {
        cache = data
        setCountries(data)
      })
      .catch(() => setCountries([]))
      .finally(() => setLoading(false))
  }, [])

  return { countries, loading }
}
