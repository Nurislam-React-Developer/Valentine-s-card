import React, { useEffect, useMemo, useState } from 'react'
import { AudioPlayer } from '../components/widgets/AudioPlayer'
import { audioService } from '../services/audioService'
import { Button } from '../components/ui/Button'
import type { AudioTrack } from '../types'

const Media: React.FC = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        const list = await audioService.loadTracks()
        if (!isMounted) return
        setTracks(list)
        setSelectedId(list[0]?.id ?? null)
      } catch (e) {
        setError('Не удалось загрузить треки. Проверьте соединение.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const orderedTracks = useMemo(() => {
    if (!selectedId) return tracks
    const current = tracks.find(t => t.id === selectedId)
    const others = tracks.filter(t => t.id !== selectedId)
    return current ? [current, ...others] : tracks
  }, [tracks, selectedId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-gray-200 p-8 bg-white/80 backdrop-blur-md">
            <div className="h-4 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
            <div className="h-24 w-full bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-red-200 p-8 bg-red-50">
            <p className="text-red-700">{error}</p>
            <Button className="mt-4" onClick={() => { setError(null); setLoading(true); audioService.loadTracks().then(t=>{ setTracks(t); setSelectedId(t[0]?.id ?? null)}).finally(()=>setLoading(false)) }}>Повторить</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Playlist */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Плейлист</h2>
            <ul className="space-y-2">
              {tracks.map((track) => (
                <li key={track.id}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${selectedId === track.id ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => setSelectedId(track.id)}
                    aria-label={`Выбрать трек ${track.title}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                      </div>
                      <span className="text-sm text-gray-500 ml-4">{Math.round(track.duration)}s</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Player */}
        <div className="lg:col-span-2">
          <AudioPlayer
            key={selectedId ?? 'player'}
            tracks={orderedTracks}
            autoPlay={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Media