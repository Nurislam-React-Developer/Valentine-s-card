import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  className?: string
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <motion.input
        whileFocus={{ scale: 1.02 }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-red-200 hover:border-red-300',
          'bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500',
          className
        )}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}