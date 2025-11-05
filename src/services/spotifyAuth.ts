// OAuth 2.0 Authorization Code with PKCE for Spotify Web API
// Docs: https://developer.spotify.com/documentation/web-api

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string
const SCOPES = (import.meta.env.VITE_SPOTIFY_SCOPES as string) || ''

const AUTH_BASE = 'https://accounts.spotify.com'

export interface TokenSet {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token?: string
  expires_at: number // epoch ms
}

const STORAGE_KEY = 'spotify_token_set'
const VERIFIER_KEY = 'spotify_pkce_verifier'

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomString(length = 64): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const values = crypto.getRandomValues(new Uint8Array(length))
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length]
  }
  return result
}

async function sha256(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

export function getStoredToken(): TokenSet | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const token = JSON.parse(raw) as TokenSet
    return token
  } catch {
    return null
  }
}

function storeToken(token: Omit<TokenSet, 'expires_at'> & { expires_in: number }) {
  const expires_at = Date.now() + token.expires_in * 1000 - 30_000 // 30s safety window
  const stored: TokenSet = { ...token, expires_at }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function startAuth(flow: 'code' | 'token' = 'code') {
  const state = randomString(16)
  const params: Record<string, string> = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state,
    scope: SCOPES,
  }

  if (flow === 'code') {
    const verifier = randomString(64)
    localStorage.setItem(VERIFIER_KEY, verifier)
    const challenge = await sha256(verifier)
    Object.assign(params, {
      response_type: 'code',
      code_challenge_method: 'S256',
      code_challenge: challenge,
    })
  } else {
    Object.assign(params, { response_type: 'token' })
  }

  const authUrl = `${AUTH_BASE}/authorize?${new URLSearchParams(params).toString()}`
  window.location.assign(authUrl)
}

export async function handleRedirect(): Promise<boolean> {
  // Support both PKCE code flow and implicit grant fallback
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''))
  const implicitToken = hashParams.get('access_token')

  if (implicitToken) {
    const expires_in = Number(hashParams.get('expires_in') || '3600')
    storeToken({ access_token: implicitToken, token_type: 'Bearer', expires_in })
    // Clean hash
    history.replaceState(null, '', `${url.origin}${url.pathname}`)
    return true
  }

  if (!code) return false

  const verifier = localStorage.getItem(VERIFIER_KEY)
  if (!verifier) return false

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  })

  try {
    const resp = await fetch(`${AUTH_BASE}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    if (!resp.ok) {
      // If CORS or 4xx, fall back to implicit grant
      throw new Error(`Token exchange failed: ${resp.status}`)
    }
    const data = await resp.json()
    storeToken(data)
    localStorage.removeItem(VERIFIER_KEY)
    // Remove query params
    history.replaceState(null, '', `${url.origin}${url.pathname}`)
    return true
  } catch (e) {
    console.warn('PKCE token exchange error, falling back to implicit grant', e)
    // Restart with implicit grant
    await startAuth('token')
    return false
  }
}

export async function getAccessToken(): Promise<string | null> {
  const token = getStoredToken()
  if (!token) return null
  if (Date.now() < token.expires_at) return token.access_token
  // Try refresh if we have refresh_token; else force re-auth
  if (!token.refresh_token) return null

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: token.refresh_token!,
    client_id: CLIENT_ID,
  })
  try {
    const resp = await fetch(`${AUTH_BASE}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    if (!resp.ok) return null
    const data = await resp.json()
    storeToken(data)
    return data.access_token as string
  } catch {
    return null
  }
}

export function isAuthorized(): boolean {
  const token = getStoredToken()
  return !!token && Date.now() < token.expires_at
}

export function logout() {
  clearToken()
}