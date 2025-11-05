import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeartAnimation } from '../components/widgets/HeartAnimation'
import { AudioPlayer } from '../components/widgets/AudioPlayer'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Settings, Palette, Music, MessageCircle } from 'lucide-react'
import { cn } from '../lib/utils'

interface AudioTrack {
  id: string
  title: string
  artist: string
  url: string
  duration: number
  cover?: string
}

interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  gradients: {
    primary: string
    secondary: string
    background: string
  }
}

const defaultTracks: AudioTrack[] = [
  {
    id: '1',
    title: 'Romantic Melody',
    artist: 'Love Orchestra',
    url: '/audio/romantic-melody.mp3',
    duration: 180,
  },
  {
    id: '2',
    title: 'Heart Beat',
    artist: 'Valentine Sounds',
    url: '/audio/heart-beat.mp3',
    duration: 210,
  },
]

const themes: Theme[] = [
  {
    id: 'valentine',
    name: 'Valentine',
    colors: {
      primary: '#ff69b4',
      secondary: '#ff1493',
      accent: '#ffd700',
      background: '#fff0f5',
      text: '#2d1b69',
    },
    gradients: {
      primary: 'from-red-400 to-pink-500',
      secondary: 'from-pink-300 to-red-400',
      background: 'from-red-50 via-pink-50 to-yellow-50',
    },
  },
  {
    id: 'romantic',
    name: 'Romantic',
    colors: {
      primary: '#dc143c',
      secondary: '#ff6b6b',
      accent: '#ffa8a8',
      background: '#fff5f5',
      text: '#2d1b69',
    },
    gradients: {
      primary: 'from-red-400 to-pink-500',
      secondary: 'from-pink-300 to-red-400',
      background: 'from-red-50 via-pink-50 to-rose-50',
    },
  },
  {
    id: 'gold',
    name: 'Golden',
    colors: {
      primary: '#ffd700',
      secondary: '#ffb347',
      accent: '#ff8c00',
      background: '#fffaf0',
      text: '#8b4513',
    },
    gradients: {
      primary: 'from-yellow-400 to-orange-500',
      secondary: 'from-orange-300 to-yellow-400',
      background: 'from-yellow-50 via-orange-50 to-amber-50',
    },
  },
]

export const ValentineCard: React.FC = () => {
  const [message, setMessage] = useState('Ты моё сердечко, ❤️')
  const [currentTheme, setCurrentTheme] = useState(themes[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMessageEditor, setShowMessageEditor] = useState(false)
  const [tempMessage, setTempMessage] = useState(message)

  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing)
  }

  const handleSaveMessage = () => {
    setMessage(tempMessage)
    setShowMessageEditor(false)
  }

  const backgroundClass = `bg-gradient-to-br ${currentTheme.gradients.background}`

  return (
    <div className={cn('min-h-screen transition-all duration-1000', backgroundClass)} data-testid="valentine-card">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-300/30 rounded-full"
            data-testid="floating-particle"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent"
        >
          💝 Valentine's Card
        </motion.h1>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMessageEditor(true)}
            data-testid="edit-message-button"
          >
            <MessageCircle size={20} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            data-testid="settings-button"
          >
            <Settings size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        {/* Heart Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
          data-testid="heart-animation"
        >
          <HeartAnimation
            isPlaying={isPlaying}
            size={200}
            sparkleCount={15}
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
            {message}
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            С Днём Святого Валентина!
          </p>
        </motion.div>

        {/* Audio Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="w-full max-w-md"
          data-testid="audio-player"
        >
          <AudioPlayer
            tracks={defaultTracks}
            onPlayStateChange={handlePlayStateChange}
            className="shadow-2xl"
          />
        </motion.div>
      </main>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Настройки"
        size="md"
        data-testid="theme-modal"
      >
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Palette className="mr-2" size={20} />
              Выберите тему
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all duration-300 text-left',
                    currentTheme.id === theme.id
                      ? 'border-valentine-500 bg-valentine-50'
                      : 'border-gray-200 hover:border-valentine-300'
                  )}
                  data-testid={`theme-option-${theme.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{theme.name}</span>
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Message Editor Modal */}
      <Modal
        isOpen={showMessageEditor}
        onClose={() => setShowMessageEditor(false)}
        title="Редактировать сообщение"
        size="md"
        data-testid="message-modal"
      >
        <div className="space-y-4">
          <Input
            value={tempMessage}
            onChange={setTempMessage}
            placeholder="Введите ваше сообщение..."
            className="text-lg"
            data-testid="message-input"
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowMessageEditor(false)}
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveMessage}
              data-testid="save-message-button"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}