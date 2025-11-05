import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music } from 'lucide-react'
import { Howl } from 'howler'
import { cn, formatTime } from '../../lib/utils'
import { Button } from '../ui/Button'
import type { AudioTrack } from '../../types'

interface AudioPlayerProps {
  tracks: AudioTrack[]
  autoPlay?: boolean
  className?: string
  onTrackChange?: (track: AudioTrack) => void
  onPlayStateChange?: (isPlaying: boolean) => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  autoPlay = false,
  className,
  onTrackChange,
  onPlayStateChange,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const howlRef = useRef<Howl | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentTrack = tracks[currentTrackIndex]

  const loadTrack = (track: AudioTrack) => {
    if (howlRef.current) {
      howlRef.current.unload()
    }

    setIsLoading(true)
    setCurrentTime(0)

    const sources = (track as any).sources?.map((s: any) => s.url) || [track.url]
    const formats = (track as any).sources?.map((s: any) => s.format)
    howlRef.current = new Howl({
      src: sources,
      format: formats,
      volume: isMuted ? 0 : volume,
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
        nextTrack()
      },
      onloaderror: () => {
        console.error('Audio loading error')
        setIsLoading(false)
      },
    })
  }

  const startProgressTracking = () => {
    progressIntervalRef.current = setInterval(() => {
      if (howlRef.current && isPlaying) {
        setCurrentTime(howlRef.current.seek() as number)
      }
    }, 100)
  }

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  const play = () => {
    if (howlRef.current) {
      howlRef.current.play()
    }
  }

  const pause = () => {
    if (howlRef.current) {
      howlRef.current.pause()
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(nextIndex)
  }

  const prevTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
  }

  const seek = (percentage: number) => {
    if (howlRef.current && duration) {
      const seekTime = duration * percentage
      howlRef.current.seek(seekTime)
      setCurrentTime(seekTime)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? volume : 0)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (howlRef.current && !isMuted) {
      howlRef.current.volume(newVolume)
    }
  }

  useEffect(() => {
    if (currentTrack) {
      loadTrack(currentTrack)
      onTrackChange?.(currentTrack)
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload()
      }
      stopProgressTracking()
    }
  }, [currentTrackIndex])

  useEffect(() => {
    onPlayStateChange?.(isPlaying)
  }, [isPlaying, onPlayStateChange])

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20',
        className
      )}
    >
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
          {currentTrack?.cover ? (
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Music className="text-white" size={24} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {currentTrack?.title || 'No track selected'}
          </h3>
          <p className="text-gray-600 text-sm truncate">
            {currentTrack?.artist || 'Unknown artist'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
          data-testid="progress-bar"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const percentage = (e.clientX - rect.left) / rect.width
            seek(percentage)
          }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevTrack}
          disabled={tracks.length <= 1}
        >
          <SkipBack size={20} />
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={togglePlay}
          disabled={isLoading || !currentTrack}
          loading={isLoading}
          className="w-14 h-14"
          data-testid={isPlaying ? "pause-button" : "play-button"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextTrack}
          disabled={tracks.length <= 1}
        >
          <SkipForward size={20} />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleMute}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            data-testid="volume-slider"
          />
        </div>
      </div>

      {/* Visualizer */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-end justify-center space-x-1 h-12"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [4, Math.random() * 40 + 4, 4],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-1 bg-gradient-to-t from-red-500 to-pink-400 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}