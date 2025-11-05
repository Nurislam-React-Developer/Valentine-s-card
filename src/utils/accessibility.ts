import React, { useEffect, useRef } from 'react'

// Hook для управления фокусом
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement>(null)

  const focusElement = () => {
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const focusableElements = focusRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (!focusableElements || focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }

  return { focusRef, focusElement, trapFocus }
}

// Hook для объявлений screen reader
export const useAnnouncement = () => {
  const announcementRef = useRef<HTMLDivElement>(null)

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority)
      announcementRef.current.textContent = message
      
      // Очищаем через небольшую задержку
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = ''
        }
      }, 1000)
    }
  }

  const AnnouncementRegion: React.FC = () => (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )

  return { announce, AnnouncementRegion }
}

// Hook для keyboard navigation
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (onEnter) {
            event.preventDefault()
            onEnter()
          }
          break
        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
          }
          break
        case 'ArrowUp':
          if (onArrowKeys) {
            event.preventDefault()
            onArrowKeys('up')
          }
          break
        case 'ArrowDown':
          if (onArrowKeys) {
            event.preventDefault()
            onArrowKeys('down')
          }
          break
        case 'ArrowLeft':
          if (onArrowKeys) {
            event.preventDefault()
            onArrowKeys('left')
          }
          break
        case 'ArrowRight':
          if (onArrowKeys) {
            event.preventDefault()
            onArrowKeys('right')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEnter, onEscape, onArrowKeys])
}

// Утилита для проверки reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Утилита для высокого контраста
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Утилита для темной темы
export const prefersDarkMode = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Hook для адаптации к пользовательским предпочтениям
export const useUserPreferences = () => {
  const reducedMotion = prefersReducedMotion()
  const highContrast = prefersHighContrast()
  const darkMode = prefersDarkMode()

  return {
    reducedMotion,
    highContrast,
    darkMode,
  }
}

// Утилита для генерации уникальных ID
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Утилита для ARIA labels
export const getAriaLabel = (
  label: string,
  description?: string,
  required?: boolean
): { 'aria-label': string; 'aria-required'?: boolean } => {
  let ariaLabel = label
  if (description) {
    ariaLabel += `, ${description}`
  }
  if (required) {
    ariaLabel += ', обязательное поле'
  }

  return {
    'aria-label': ariaLabel,
    ...(required && { 'aria-required': true }),
  }
}

// Компонент для skip links
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
  >
    {children}
  </a>
)