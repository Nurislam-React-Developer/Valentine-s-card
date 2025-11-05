import React, { useEffect, useRef, useState } from 'react'

interface PlayerProps {
  src: string | null
  title?: string
  artist?: string
  cover?: string
}

export const SpotifyPlayer: React.FC<PlayerProps> = ({ src, title, artist, cover }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(30)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => {
      setProgress(a.currentTime)
    }
    const onLoaded = () => {
      setDuration(a.duration || 30)
    }
    const onEnded = () => setIsPlaying(false)
    const onError = () => setError('Ошибка воспроизведения превью')
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onLoaded)
    a.addEventListener('ended', onEnded)
    a.addEventListener('error', onError)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onLoaded)
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    // Reset when track changes
    const a = audioRef.current
    if (a) {
      a.pause()
      a.currentTime = 0
      setIsPlaying(false)
      setProgress(0)
      setError(null)
    }
  }, [src])

  const toggle = async () => {
    const a = audioRef.current
    if (!a || !src) return
    if (isPlaying) {
      a.pause()
      setIsPlaying(false)
    } else {
      try {
        await a.play()
        setIsPlaying(true)
      } catch (e) {
        setError('Автовоспроизведение заблокировано браузером')
      }
    }
  }

  const seek = (value: number) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = value
    setProgress(value)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-center gap-4">
        {cover ? (
          <img src={cover} alt="cover" className="h-16 w-16 rounded-md object-cover"/>
        ) : (
          <div className="h-16 w-16 rounded-md bg-gray-200"/>
        )}
        <div className="flex-1">
          <div className="font-semibold text-gray-800 truncate">{title || 'Не выбран трек'}</div>
          <div className="text-sm text-gray-500 truncate">{artist}</div>
        </div>
        <button onClick={toggle} disabled={!src} className="rounded-full bg-pink-500 text-white px-4 py-2 disabled:opacity-50">
          {isPlaying ? 'Пауза' : 'Играть'}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <input type="range" min={0} max={duration} step={0.1} value={progress} onChange={(e) => seek(Number(e.target.value))} className="flex-1"/>
        <div className="text-xs text-gray-600">{Math.floor(progress)}s / {Math.floor(duration)}s</div>
      </div>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      <audio ref={audioRef} src={src ?? undefined} preload="metadata"/>
    </div>
  )
}

export default SpotifyPlayer