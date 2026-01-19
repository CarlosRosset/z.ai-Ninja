'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { SURFACE_TOKENS, getSurfaceTokens, Theme } from './surface-tokens'

interface SectionCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  theme?: Theme
}

/**
 * SectionCard - Standardized container for functional sections
 * Used consistently across all app screens for:
 * - Search + filter bars
 * - Card grids
 * - Metric displays
 * - Control panels
 */
export default function SectionCard({
  children,
  className = '',
  padding = 'md',
  theme: propTheme
}: SectionCardProps) {
  const { theme: currentTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const candidate = (propTheme || resolvedTheme || currentTheme || 'dark') as string
  const theme = candidate === 'light' ? 'light' : 'dark'
  const tokens = getSurfaceTokens(theme) || SURFACE_TOKENS.dark

  const paddingMap = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-7',
  }

  return (
    <div
      className={`
        rounded-xl border-2
        ${tokens.panel}
        ${tokens.borderPanel}
        ${tokens.shadowCard}
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
