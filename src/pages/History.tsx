import React, { useMemo } from 'react'
import { getViewHistory } from '../hooks/useViewHistory'

const History: React.FC = () => {
  const entries = useMemo(() => getViewHistory(), [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md p-6">
        <h1 className="text-xl font-semibold mb-4">История просмотров</h1>
        {entries.length === 0 ? (
          <p className="text-gray-600">История пока пуста.</p>
        ) : (
          <ul className="space-y-2">
            {entries.map((e, i) => (
              <li key={`${e.path}-${e.timestamp}-${i}`} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100">
                <span className="text-gray-800">{e.path}</span>
                <span className="text-sm text-gray-500">{new Date(e.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default History