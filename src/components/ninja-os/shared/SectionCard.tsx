'use client'

import { useTheme } from 'next-themes'
import { getSurfaceTokens, Theme } from './surface-tokens'

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
  const { theme: currentTheme } = useTheme()
  const theme = propTheme || (currentTheme as Theme)
  const tokens = getSurfaceTokens(theme)

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
