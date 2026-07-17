"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { API_ROUTES } from "@/lib/constants/api-routes"
import type { City } from "@/lib/types/city"

interface CitiesResponse {
  countryId: number
  countryName: string
  cities: City[]
}

const cache = new Map<number, City[]>()

export function useCities(countryId: number | null) {
  const [cities, setCities] = useState<City[]>(countryId != null ? cache.get(countryId) ?? [] : [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (countryId == null) {
      setCities([])
      return
    }
    const cached = cache.get(countryId)
    if (cached) {
      setCities(cached)
      return
    }
    setLoading(true)
    api
      .get<CitiesResponse>(API_ROUTES.LOCATIONS.CITIES(countryId))
      .then(({ data }) => {
        cache.set(countryId, data.cities)
        setCities(data.cities)
      })
      .catch(() => setCities([]))
      .finally(() => setLoading(false))
  }, [countryId])

  return { cities, loading }
}
