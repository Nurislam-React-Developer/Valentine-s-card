export interface AudioTrack {
  id: string
  title: string
  artist: string
  url: string
  duration: number
  cover?: string
  format?: 'mp3' | 'aac' | 'ogg' | 'wav'
  sources?: { format: 'mp3' | 'aac' | 'ogg' | 'wav'; url: string }[]
  mimeType?: string
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  currentTrack: AudioTrack | null
  playlist: AudioTrack[]
  currentTrackIndex: number
  isLoading: boolean
  error: string | null
}

export interface HeartAnimationConfig {
  size: number
  color: string
  sparkleCount: number
  animationDuration: number
  sparkleDelay: number
}

export interface SparkleParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  opacity: number
}

export interface TouchGesture {
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
  distance: number
  direction: 'left' | 'right' | 'up' | 'down' | null
}

export interface Theme {
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

export interface ValentineCardProps {
  message?: string
  theme?: Theme
  showAudioPlayer?: boolean
  enableAnimations?: boolean
  onThemeChange?: (theme: Theme) => void
  onMessageChange?: (message: string) => void
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: () => void
}