import { useState, useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import type { AudioTrack } from '../types'

interface UseAudioOptions {
  autoPlay?: boolean
  volume?: number
  onTrackEnd?: () => void
  onError?: (error: string) => void
}

export const useAudio = (track: AudioTrack | null, options: UseAudioOptions = {}) => {
  const { autoPlay = false, volume = 0.7, onTrackEnd, onError } = options
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const howlRef = useRef<Howl | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startProgressTracking = useCallback(() => {
    progressIntervalRef.current = setInterval(() => {
      if (howlRef.current && isPlaying) {
        setCurrentTime(howlRef.current.seek() as number)
      }
    }, 100)
  }, [isPlaying])

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  const loadTrack = useCallback((audioTrack: AudioTrack) => {
    if (howlRef.current) {
      howlRef.current.unload()
    }

    setIsLoading(true)
    setCurrentTime(0)
    setError(null)

    const sources = audioTrack.sources?.map(s => s.url) || [audioTrack.url]
    const formats = audioTrack.sources?.map(s => s.format)
    howlRef.current = new Howl({
      src: sources,
      format: formats,
      volume,
      onload: () => {
        setDuration(howlRef.current?.duration() || 0)
        setIsLoading(false)
        if (autoPlay) {
          play()
        }
      },
      onplay: () => {
        setIsPlaying(true)
        startProgressTracking()
      },
      onpause: () => {
        setIsPlaying(false)
        stopProgressTracking()
      },
      onstop: () => {
        setIsPlaying(false)
        setCurrentTime(0)
        stopProgressTracking()
      },
      onend: () => {
        setIsPlaying(false)
        setCurrentTime(0)
        stopProgressTracking()
        onTrackEnd?.()
      },
      onloaderror: () => {
        const errorMsg = 'Failed to load audio track'
        setError(errorMsg)
        setIsLoading(false)
        onError?.(errorMsg)
      },
    })
  }, [volume, autoPlay, startProgressTracking, stopProgressTracking, onTrackEnd, onError])

  const play = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.play()
    }
  }, [])

  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause()
    }
  }, [])

  const stop = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.stop()
    }
  }, [])

  const seek = useCallback((time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time)
      setCurrentTime(time)
    }
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    if (howlRef.current) {
      howlRef.current.volume(newVolume)
    }
  }, [])

  useEffect(() => {
    if (track) {
      loadTrack(track)
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload()
      }
      stopProgressTracking()
    }
  }, [track, loadTrack, stopProgressTracking])

  return {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    play,
    pause,
    stop,
    seek,
    setVolume,
  }
}