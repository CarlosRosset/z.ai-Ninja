'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { TILE_TOKENS, getTileTokens, Theme } from './surface-tokens'

interface PageHeroProps {
  icon: string
  title: string
  subtitle: string
  theme?: Theme
}

/**
 * PageHero - Standardized page header component
 * Used consistently across all app screens
 * - Tile with icon (same style in both themes)
 * - Title (primary text)
 * - Subtitle (accent color, monospace)
 */
export default function PageHero({ icon, title, subtitle, theme: propTheme }: PageHeroProps) {
  const { theme: currentTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const candidate = (propTheme || resolvedTheme || currentTheme || 'dark') as string
  const theme = candidate === 'light' ? 'light' : 'dark'
  const tileTokens = getTileTokens(theme) || TILE_TOKENS.dark

  return (
    <div className="flex items-center gap-4">
      {/* Tile icon - consistent in both themes */}
      <div className={`${tileTokens.size} rounded-lg flex items-center justify-center border ${tileTokens.bg} ${tileTokens.border} ${tileTokens.shadow}`}>
        <span className={tileTokens.iconSize}>{icon}</span>
      </div>

      {/* Title and subtitle */}
      <div>
        <h1 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-mono`}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}
