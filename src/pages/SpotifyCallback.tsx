import React, { useEffect } from 'react'
import { handleRedirect } from '../services/spotifyAuth'
import { Link } from '@tanstack/react-router'

const SpotifyCallback: React.FC = () => {
  useEffect(() => {
    const run = async () => {
      await handleRedirect()
    }
    run()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white/80 backdrop-blur-md p-6 text-center">
        <h1 className="text-xl font-semibold">Завершение авторизации…</h1>
        <p className="mt-2 text-gray-600">Если страница не перенаправила вас автоматически, вернитесь на раздел Spotify.</p>
        <Link to="/spotify" className="mt-4 inline-block rounded-md bg-green-600 text-white px-4 py-2">Перейти к Spotify</Link>
      </div>
    </div>
  )
}

export default SpotifyCallback