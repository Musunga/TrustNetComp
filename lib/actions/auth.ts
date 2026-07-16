"use server"

import { unstable_rethrow } from "next/navigation"
import api, { getApiErrorMessage } from "../api"
import { getSession } from "../session"
import { API_ROUTES } from "../constants/api-routes"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_SESSION_STORAGE_KEY,
  ACTIVE_COMPANY_STORAGE_KEY,
} from "../constants/variables"
import type { LoginRequest, LoginResponseI, RegisterRequest } from "../types/auth"

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
    unstable_rethrow(error)
    throw new Error(getApiErrorMessage(error) ?? "Invalid email or password. Please try again.")
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

export const register = async (payload: RegisterRequest) => {
  try {
    console.log("Register payload:", payload) // Log the payload for debugging
    const url = API_ROUTES.AUTH.REGISTER
     console.log("Register url==========>", url) 
    const response = await api.post<LoginResponseI>(url, payload)
    const data: LoginResponseI = response.data
    const accessToken = data.token
    if (accessToken) {
      const session = await getSession()
      session.accessToken = accessToken
      await session.save()
    }
   // Log the entire response for debugging
    console.log("Register response data:", response) // Log the response data for debugging
    return data
  } catch (error) {
    unstable_rethrow(error)
    throw new Error(getApiErrorMessage(error) ?? "Could not create account. Please try again.")
  }
}
