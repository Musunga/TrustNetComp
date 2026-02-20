import axios from "axios";
import { cookies } from "next/headers"
import { ACCESS_TOKEN_COOKIE_NAME, BASE_URL } from "./constants/variables";

// In the browser, use relative URLs so Next.js rewrites proxy to the backend,
// avoiding CORS issues. On the server, use BASE_URL.
const computedBaseURL = typeof window === "undefined" ? BASE_URL : "";

export async function getAuthHeaders(): Promise<{ Authorization?: string} > {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export const api = axios.create({
  baseURL: computedBaseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach Bearer token from localStorage (like binit-admin)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ACCESS_TOKEN_COOKIE_NAME);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 clear token and redirect to login (like binit-admin)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_COOKIE_NAME);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

if (process.env.NODE_ENV !== "production") {
  // Helpful to confirm baseURL in dev
  // eslint-disable-next-line no-console
  console.debug("[api] baseURL:", api.defaults.baseURL || "(relative)");
}

export default api;
