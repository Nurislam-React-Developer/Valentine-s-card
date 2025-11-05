import React, { useEffect, useRef, useState } from 'react'

interface RouteProgressProps {
  active: boolean
}

export const RouteProgress: React.FC<RouteProgressProps> = ({ active }) => {
  const [width, setWidth] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (active) {
      setWidth(10)
      timerRef.current = window.setInterval(() => {
        setWidth((w) => (w < 95 ? w + Math.random() * 5 : w))
      }, 200)
    } else {
      setWidth(100)
      const t = window.setTimeout(() => setWidth(0), 300)
      return () => window.clearTimeout(t)
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [active])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export default RouteProgress