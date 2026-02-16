import api from "../api";
import { API_ROUTES } from "../constants/api-routes";
import { ACCESS_TOKEN_COOKIE_NAME } from "../constants/variables";
import type { LoginRequest, LoginResponseI } from "../types/auth";

export const login = async (
  email: LoginRequest["email"],
  password: LoginRequest["password"]
) => {
  try {
    const response = await api.post<LoginResponseI>(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });

    const data: LoginResponseI = response.data;

    const accessToken = data.token;
    if (typeof window !== "undefined" && accessToken) {
      localStorage.setItem(ACCESS_TOKEN_COOKIE_NAME, accessToken);
    }
    return data;
    } catch (error) {
      return Promise.reject(error);
    }
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_COOKIE_NAME);
  // Clear cookie so middleware sees user as logged out (like binit-admin flow)
  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
  window.location.href = "/login";
};
