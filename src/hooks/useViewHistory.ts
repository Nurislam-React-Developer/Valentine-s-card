import { useEffect, useState } from 'react'

export interface HistoryEntry {
  path: string
  timestamp: number
}

const STORAGE_KEY = 'view_history'

export const useViewHistory = (path: string) => {
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: HistoryEntry[] = raw ? JSON.parse(raw) : []
    list.unshift({ path, timestamp: Date.now() })
    const deduped = list.filter((e, idx, arr) => idx === arr.findIndex(x => x.path === e.path && Math.abs(x.timestamp - e.timestamp) > 1000))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped.slice(0, 50)))
  }, [path])
}

export const getViewHistory = (): HistoryEntry[] => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}