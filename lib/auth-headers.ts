import "server-only"
import { getSession } from "@/lib/session"

export async function getAuthHeaders(): Promise<{ Authorization?: string }> {
  const session = await getSession()
  const token = session.accessToken
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}
