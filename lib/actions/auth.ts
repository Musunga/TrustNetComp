"use server"

import api from "../api"
import { getSession } from "../session"
import { API_ROUTES } from "../constants/api-routes"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_SESSION_STORAGE_KEY,
  ACTIVE_COMPANY_STORAGE_KEY,
} from "../constants/variables"
import type { LoginRequest, LoginResponseI } from "../types/auth"

export const login = async (
  email: LoginRequest["email"],
  password: LoginRequest["password"]
) => {
  try {
    const response = await api.post<LoginResponseI>(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    })
    const data: LoginResponseI = response.data
    const accessToken = data.token
    if (accessToken) {
      const session = await getSession()
      session.accessToken = accessToken
      await session.save()
    }
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const logout = async () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_COOKIE_NAME)
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY)
  // Full redirect so clear-session route runs and destroys iron-session cookie
  window.location.href = "/api/auth/clear-session?redirect=/login"
}
