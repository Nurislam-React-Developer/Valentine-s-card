import { getAccessToken, isAuthorized } from './spotifyAuth'

const API_BASE = 'https://api.spotify.com/v1'

export interface SpotifyImage { url: string; height?: number; width?: number }
export interface SpotifyArtist { id: string; name: string }
export interface SpotifyAlbum { id: string; name: string; images: SpotifyImage[] }
export interface SpotifyTrack {
  id: string
  name: string
  duration_ms: number
  preview_url: string | null
  artists: SpotifyArtist[]
  album: SpotifyAlbum
}

export interface SpotifyPlaylist {
  id: string
  name: string
  images: SpotifyImage[]
}

// In-memory cache with TTL
const cache = new Map<string, { ts: number; data: any }>()
const TTL = 1000 * 60 * 5 // 5 minutes

function setCache(key: string, data: any) {
  cache.set(key, { ts: Date.now(), data })
}
function getCache(key: string) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

async function authHeader(): Promise<HeadersInit> {
  const token = await getAccessToken()
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  return { Authorization: `Bearer ${token}` }
}

export interface SearchResponse {
  tracks: { items: SpotifyTrack[]; total: number; limit: number; offset: number }
}

export async function searchTracks(
  q: string,
  limit = 20,
  offset = 0
): Promise<SearchResponse> {
  if (!isAuthorized()) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 })
  }
  const key = `search:${q}:${limit}:${offset}`
  const cached = getCache(key)
  if (cached) return cached

  const headers = await authHeader()
  const url = `${API_BASE}/search?${new URLSearchParams({ q, type: 'track', limit: String(limit), offset: String(offset) })}`
  const resp = await fetch(url, { headers })
  if (resp.status === 429) {
    const retry = Number(resp.headers.get('Retry-After') || '1')
    await new Promise((r) => setTimeout(r, retry * 1000))
    return searchTracks(q, limit, offset)
  }
  if (!resp.ok) {
    const text = await resp.text()
    throw Object.assign(new Error(text || 'Spotify API error'), { status: resp.status })
  }
  const data = (await resp.json()) as SearchResponse
  setCache(key, data)
  return data
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export async function getFeaturedPlaylists(country = 'US', limit = 10): Promise<SpotifyPlaylist[]> {
  const key = `featured:${country}:${limit}`
  const cached = getCache(key)
  if (cached) return cached
  const headers = await authHeader()
  const url = `${API_BASE}/browse/featured-playlists?${new URLSearchParams({ country, limit: String(limit) })}`
  const resp = await fetch(url, { headers })
  if (!resp.ok) {
    const text = await resp.text()
    throw Object.assign(new Error(text || 'Spotify API error'), { status: resp.status })
  }
  const data = await resp.json()
  const playlists: SpotifyPlaylist[] = (data.playlists?.items || []).map((p: any) => ({ id: p.id, name: p.name, images: p.images }))
  setCache(key, playlists)
  return playlists
}

export async function getPlaylistTracks(playlistId: string, limit = 50): Promise<SpotifyTrack[]> {
  const key = `playlist:${playlistId}:${limit}`
  const cached = getCache(key)
  if (cached) return cached
  const headers = await authHeader()
  const url = `${API_BASE}/playlists/${playlistId}/tracks?${new URLSearchParams({ limit: String(limit) })}`
  const resp = await fetch(url, { headers })
  if (!resp.ok) {
    const text = await resp.text()
    throw Object.assign(new Error(text || 'Spotify API error'), { status: resp.status })
  }
  const data = await resp.json()
  const tracks: SpotifyTrack[] = (data.items || [])
    .map((i: any) => i.track)
    .filter((t: any) => !!t)
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      duration_ms: t.duration_ms,
      preview_url: t.preview_url || null,
      artists: t.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
      album: { id: t.album?.id, name: t.album?.name, images: t.album?.images || [] },
    }))
  setCache(key, tracks)
  return tracks
}

export async function getFeaturedPreviewTracks(limit = 12, country = 'US'): Promise<SpotifyTrack[]> {
  try {
    const playlists = await getFeaturedPlaylists(country, 10)
    for (const p of playlists) {
      const tracks = await getPlaylistTracks(p.id, 50)
      const withPreview = tracks.filter((t) => !!t.preview_url)
      if (withPreview.length >= 1) {
        return withPreview.slice(0, limit)
      }
    }
  } catch (e) {
    // Fallback: simple search
    try {
      const res = await searchTracks('love', limit, 0)
      return (res.tracks.items || []).filter((t) => !!t.preview_url).slice(0, limit)
    } catch {}
  }
  return []
}