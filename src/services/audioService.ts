import type { AudioTrack } from '../types'

// Mock audio tracks for demonstration
export const defaultTracks: AudioTrack[] = [
  {
    id: '1',
    title: 'Romantic Melody',
    artist: 'Love Orchestra',
    url: '/audio/romantic-melody.mp3',
    format: 'mp3',
    sources: [
      { format: 'mp3', url: '/audio/romantic-melody.mp3' },
      { format: 'ogg', url: '/audio/romantic-melody.ogg' },
    ],
    duration: 180,
    cover: '/images/romantic-cover.jpg',
  },
  {
    id: '2',
    title: 'Heart Beat',
    artist: 'Valentine Sounds',
    url: '/audio/heart-beat.mp3',
    format: 'mp3',
    sources: [
      { format: 'mp3', url: '/audio/heart-beat.mp3' },
      { format: 'aac', url: '/audio/heart-beat.aac' },
    ],
    duration: 210,
    cover: '/images/heart-cover.jpg',
  },
  {
    id: '3',
    title: 'Love Song',
    artist: 'Romantic Vibes',
    url: '/audio/love-song.mp3',
    format: 'mp3',
    sources: [
      { format: 'mp3', url: '/audio/love-song.mp3' },
      { format: 'wav', url: '/audio/love-song.wav' },
    ],
    duration: 195,
    cover: '/images/love-cover.jpg',
  },
]

export class AudioService {
  private static instance: AudioService
  private tracks: AudioTrack[] = defaultTracks

  private constructor() {}

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService()
    }
    return AudioService.instance
  }

  getTracks(): AudioTrack[] {
    return this.tracks
  }

  getTrackById(id: string): AudioTrack | undefined {
    return this.tracks.find(track => track.id === id)
  }

  addTrack(track: AudioTrack): void {
    this.tracks.push(track)
  }

  removeTrack(id: string): void {
    this.tracks = this.tracks.filter(track => track.id !== id)
  }

  updateTrack(id: string, updates: Partial<AudioTrack>): void {
    const index = this.tracks.findIndex(track => track.id === id)
    if (index !== -1) {
      this.tracks[index] = { ...this.tracks[index], ...updates }
    }
  }

  // Simulate loading tracks from an API
  async loadTracks(): Promise<AudioTrack[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.tracks)
      }, 500)
    })
  }

  // Validate audio URL
  async validateAudioUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.oncanplaythrough = () => resolve(true)
      audio.onerror = () => resolve(false)
      audio.src = url
    })
  }

  // Get audio metadata
  async getAudioMetadata(file: File): Promise<Partial<AudioTrack>> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)
      
      audio.onloadedmetadata = () => {
        const metadata: Partial<AudioTrack> = {
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          duration: audio.duration,
          url,
          mimeType: file.type,
          format: (file.type.match(/audio\/(mp3|mpeg)/) ? 'mp3'
            : file.type.includes('aac') ? 'aac'
            : file.type.includes('ogg') ? 'ogg'
            : file.type.includes('wav') ? 'wav'
            : undefined),
          sources: [{ format: 'mp3', url }],
        }
        resolve(metadata)
      }
      
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load audio metadata'))
      }
      
      audio.src = url
    })
  }
}

export const audioService = AudioService.getInstance()