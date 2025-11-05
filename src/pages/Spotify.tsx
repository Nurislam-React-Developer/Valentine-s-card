import React, { useEffect, useMemo, useState } from 'react'
import { useSpotifyAuth } from '../hooks/useSpotifyAuth'
import { useSpotifySearch } from '../hooks/useSpotifySearch'
import { SpotifyPlayer } from '../components/spotify/SpotifyPlayer'
import { getFeaturedPreviewTracks, SpotifyTrack } from '../services/spotifyApi'

const SpotifyPage: React.FC = () => {
  const { authorized, initialized, error: authError, login, logout } = useSpotifyAuth()
  const [q, setQ] = useState('')
  const { items, isLoading, isError, error, suggestions, nextPage, prevPage, total, offset, limit, formatDuration } = useSpotifySearch(q, { limit: 12 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [featured, setFeatured] = useState<SpotifyTrack[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(false)
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null)

  const selected = useMemo(() => {
    const list = q.trim().length > 0 ? items : featured
    return list.find((t) => t.id === selectedId) || list[0]
  }, [q, items, featured, selectedId])

  const canSearch = authorized && initialized

  useEffect(() => {
    const load = async () => {
      if (!canSearch) return
      setLoadingFeatured(true)
      setErrorFeatured(null)
      try {
        const data = await getFeaturedPreviewTracks(12, 'US')
        setFeatured(data)
        if (!selectedId && data.length > 0) {
          setSelectedId(data[0].id)
        }
      } catch (e: any) {
        setErrorFeatured(e?.message || 'Не удалось загрузить популярные треки')
      } finally {
        setLoadingFeatured(false)
      }
    }
    load()
  }, [canSearch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Spotify поиск</h1>
          {authorized ? (
            <button onClick={logout} className="text-sm rounded-md border px-3 py-1 hover:bg-gray-50">Выйти</button>
          ) : (
            <button onClick={login} className="text-sm rounded-md bg-green-600 text-white px-3 py-1">Войти через Spotify</button>
          )}
        </div>

        {!initialized && <div className="mt-6 text-gray-600">Инициализация авторизации…</div>}
        {authError && <div className="mt-6 text-red-600">{authError}</div>}

        {canSearch && (
          <div className="mt-6">
            <label className="block text-sm text-gray-700 mb-1">Поиск треков</label>
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2"
              placeholder="Введите название или исполнителя"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            {/* Autocomplete */}
            {q && suggestions.length > 0 && (
              <ul className="mt-2 rounded-md border bg-white shadow-sm divide-y">
                {suggestions.map((s) => (
                  <li key={s.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => setQ(s.text.split(' — ')[0])}>{s.text}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {canSearch && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Player */}
              <SpotifyPlayer
                src={selected?.preview_url ?? null}
                title={selected?.name}
                artist={selected?.artists.map((a) => a.name).join(', ')}
                cover={selected?.album.images?.[0]?.url}
              />
            </div>
            <div>
              {q.trim().length > 0 ? (
                <>
                  {isLoading && <div className="rounded-xl border p-4">Загрузка…</div>}
                  {isError && <div className="rounded-xl border p-4 text-red-600">{(error as any)?.message || 'Ошибка поиска'}</div>}
                  {!isLoading && !isError && (
                    <div>
                      <ul className="divide-y rounded-xl border bg-white/80 backdrop-blur-md">
                        {items.map((t) => (
                          <li key={t.id} className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer ${selectedId === t.id ? 'bg-gray-50' : ''}`} onClick={() => setSelectedId(t.id)}>
                            <img src={t.album.images?.[2]?.url || t.album.images?.[0]?.url} alt="cover" className="h-12 w-12 rounded object-cover"/>
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-gray-800">{t.name}</div>
                              <div className="truncate text-sm text-gray-500">{t.artists.map((a) => a.name).join(', ')}</div>
                            </div>
                            <div className="text-sm text-gray-600">{formatDuration(t.duration_ms)}</div>
                          </li>
                        ))}
                        {items.length === 0 && (
                          <li className="px-3 py-3 text-gray-600">Нет треков с доступным превью</li>
                        )}
                      </ul>
                      {total > limit && (
                        <div className="mt-3 flex items-center justify-between">
                          <button className="rounded-md border px-3 py-1" onClick={prevPage} disabled={offset === 0}>Назад</button>
                          <div className="text-sm text-gray-600">{offset + 1}-{Math.min(offset + limit, total)} из {total}</div>
                          <button className="rounded-md border px-3 py-1" onClick={nextPage} disabled={offset + limit >= total}>Вперёд</button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {loadingFeatured && <div className="rounded-xl border p-4">Загрузка популярных треков…</div>}
                  {errorFeatured && <div className="rounded-xl border p-4 text-red-600">{errorFeatured}</div>}
                  {!loadingFeatured && !errorFeatured && (
                    <div>
                      <div className="mb-2 text-sm text-gray-600">Популярные треки</div>
                      <ul className="divide-y rounded-xl border bg-white/80 backdrop-blur-md">
                        {featured.map((t) => (
                          <li key={t.id} className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer ${selectedId === t.id ? 'bg-gray-50' : ''}`} onClick={() => setSelectedId(t.id)}>
                            <img src={t.album.images?.[2]?.url || t.album.images?.[0]?.url} alt="cover" className="h-12 w-12 rounded object-cover"/>
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-gray-800">{t.name}</div>
                              <div className="truncate text-sm text-gray-500">{t.artists.map((a) => a.name).join(', ')}</div>
                            </div>
                            <div className="text-sm text-gray-600">{formatDuration(t.duration_ms)}</div>
                          </li>
                        ))}
                        {featured.length === 0 && (
                          <li className="px-3 py-3 text-gray-600">Не удалось получить популярные треки</li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpotifyPage