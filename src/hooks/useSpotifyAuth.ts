import { useEffect, useState } from 'react'
import { handleRedirect, isAuthorized, startAuth, logout, getStoredToken } from '../services/spotifyAuth'

export const useSpotifyAuth = () => {
  const [authorized, setAuthorized] = useState<boolean>(isAuthorized())
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const handled = await handleRedirect()
        if (handled) setAuthorized(true)
      } catch (e: any) {
        setError(e?.message || 'Auth error')
      } finally {
        setInitialized(true)
      }
    }
    run()
  }, [])

  const login = async () => {
    try {
      await startAuth('code')
    } catch (e: any) {
      setError(e?.message || 'Auth start error')
    }
  }

  const signOut = () => {
    logout()
    setAuthorized(false)
  }

  return {
    authorized,
    initialized,
    error,
    login,
    logout: signOut,
    token: getStoredToken(),
  }
}