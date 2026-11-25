const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL

let cachedToken: { email: string; token: string } | null = null

export async function getJwtToken(email: string): Promise<string> {
  const normalizedEmail = email.toLowerCase()
  if (cachedToken?.email === normalizedEmail) return cachedToken.token

  const res = await fetch(`${baseurl}/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.token) {
    throw new Error(data?.message || "Failed to get auth token")
  }

  cachedToken = { email: normalizedEmail, token: data.token }
  return data.token as string
}

export async function authHeaders(email: string): Promise<Record<string, string>> {
  const token = await getJwtToken(email)
  return { Authorization: `Bearer ${token}` }
}

export function clearJwtToken() {
  cachedToken = null
}
