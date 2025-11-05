import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('returns stored value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(localStorageMock.getItem('test-key')).toBe('"new-value"')
  })

  it('handles complex objects', () => {
    const initialObject = { name: 'test', count: 0 }
    const { result } = renderHook(() => useLocalStorage('test-object', initialObject))
    
    const newObject = { name: 'updated', count: 5 }
    act(() => {
      result.current[1](newObject)
    })

    expect(result.current[0]).toEqual(newObject)
    expect(JSON.parse(localStorageMock.getItem('test-object')!)).toEqual(newObject)
  })

  it('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-counter', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('handles localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock setItem to throw an error
    const originalSetItem = localStorageMock.setItem
    localStorageMock.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(consoleSpy).toHaveBeenCalled()
    
    // Restore original setItem
    localStorageMock.setItem = originalSetItem
    consoleSpy.mockRestore()
  })
})