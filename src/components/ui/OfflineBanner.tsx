import React, { useEffect, useState } from 'react'

export const OfflineBanner: React.FC = () => {
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-2 shadow">
          Нет соединения с интернетом. Некоторые функции недоступны.
        </div>
      </div>
    </div>
  )
}

export default OfflineBanner