import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTracks, formatDuration, SpotifyTrack } from '../services/spotifyApi'
import { useDebounce } from '../utils/performance'

export interface UseSpotifySearchOptions {
  limit?: number
}

export const useSpotifySearch = (query: string, { limit = 10 }: UseSpotifySearchOptions = {}) => {
  const [offset, setOffset] = useState(0)
  const [internalQuery, setInternalQuery] = useState(query)
  const debouncedSet = useDebounce((q: string) => setInternalQuery(q), 300)

  useEffect(() => {
    debouncedSet(query)
    setOffset(0)
  }, [query])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['spotify', 'search', internalQuery, limit, offset],
    queryFn: () => searchTracks(internalQuery, limit, offset),
    enabled: internalQuery.trim().length > 0,
  })

  const items = useMemo(() => (data?.tracks.items ?? []).filter((t) => !!t.preview_url), [data])

  const nextPage = () => {
    if (!data) return
    const next = offset + limit
    if (next < data.tracks.total) setOffset(next)
  }
  const prevPage = () => setOffset((o) => Math.max(0, o - limit))

  const suggestions = useMemo(() => items.slice(0, 5).map((t) => ({ id: t.id, text: `${t.name} — ${t.artists.map((a) => a.name).join(', ')}` })), [items])

  return {
    items,
    isLoading,
    isError,
    error: error as any,
    nextPage,
    prevPage,
    offset,
    total: data?.tracks.total ?? 0,
    limit,
    suggestions,
    formatDuration,
  }
}