import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn, randomBetween, getRandomItem } from '../../lib/utils'

interface SparkleParticle {
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

interface HeartAnimationProps {
  isPlaying?: boolean
  size?: number
  className?: string
  sparkleCount?: number
  colors?: string[]
}

const defaultColors = [
  '#ff69b4', // hot pink
  '#ff1493', // deep pink
  '#ffd700', // gold
  '#ffb6c1', // light pink
  '#ff6347', // tomato
  '#ff4500', // orange red
]

export const HeartAnimation: React.FC<HeartAnimationProps> = ({
  isPlaying = false,
  size = 120,
  className,
  sparkleCount = 12,
  colors = defaultColors,
}) => {
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([])
  const animationRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const createSparkle = (index: number): SparkleParticle => {
    const angle = (index / sparkleCount) * Math.PI * 2
    const radius = size * 0.6
    const centerX = size / 2
    const centerY = size / 2

    // Начальная позиция около сердца
    const startX = centerX + Math.cos(angle) * (size * 0.3)
    const startY = centerY + Math.sin(angle) * (size * 0.3)

    // Скорость движения
    const speed = randomBetween(2, 4)
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed

    return {
      id: `sparkle-${index}-${Date.now()}`,
      x: startX,
      y: startY,
      vx,
      vy,
      life: 0,
      maxLife: randomBetween(60, 120), // frames
      size: randomBetween(4, 8),
      color: getRandomItem(colors),
      opacity: 1,
    }
  }

  const updateSparkles = () => {
    setSparkles(prevSparkles => {
      return prevSparkles
        .map(sparkle => ({
          ...sparkle,
          x: sparkle.x + sparkle.vx,
          y: sparkle.y + sparkle.vy,
          life: sparkle.life + 1,
          opacity: Math.max(0, 1 - (sparkle.life / sparkle.maxLife)),
          vy: sparkle.vy + 0.1, // гравитация
        }))
        .filter(sparkle => sparkle.life < sparkle.maxLife)
    })
  }

  const animate = () => {
    updateSparkles()
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      // Создаем искры поэтапно
      const createSparklesSequentially = () => {
        for (let i = 0; i < sparkleCount; i++) {
          setTimeout(() => {
            setSparkles(prev => [...prev, createSparkle(i)])
          }, i * 100) // задержка между появлением искр
        }
      }

      createSparklesSequentially()
      animationRef.current = requestAnimationFrame(animate)

      // Периодически добавляем новые искры
      const interval = setInterval(() => {
        setSparkles(prev => {
          if (prev.length < sparkleCount * 2) {
            const newSparkles = Array.from({ length: 3 }, (_, i) => createSparkle(Math.random() * sparkleCount))
            return [...prev, ...newSparkles]
          }
          return prev
        })
      }, 1000)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        clearInterval(interval)
      }
    } else {
      setSparkles([])
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, sparkleCount])

  useEffect(() => {
    if (isPlaying && sparkles.length > 0) {
      animationRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [sparkles, isPlaying])

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Сердце */}
      <motion.div
        animate={isPlaying ? {
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, 0],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className="relative z-10"
      >
        <Heart
          size={size * 0.6}
          className="text-red-500 fill-current drop-shadow-lg"
          data-testid="heart-icon"
          style={{
            filter: isPlaying ? 'drop-shadow(0 0 20px rgba(255, 105, 180, 0.6))' : 'none',
          }}
        />
      </motion.div>

      {/* Искры */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: sparkle.opacity }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute pointer-events-none"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
              backgroundColor: sparkle.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Дополнительные эффекты свечения */}
      {isPlaying && (
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full bg-gradient-radial from-red-300/30 to-transparent"
        />
      )}
    </div>
  )
}