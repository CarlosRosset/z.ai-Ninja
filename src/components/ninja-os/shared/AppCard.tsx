'use client'

import { useTheme } from 'next-themes'
import { getSurfaceTokens, getTileTokens, Theme } from './surface-tokens'

interface AppCardProps {
  title: string
  description: string
  icon?: string
  category: string
  isRunning?: boolean
  isDisabled?: boolean
  minLevel?: number
  onClick?: () => void
  theme?: Theme
}

/**
 * AppCard - Standardized app card for App Launcher
 * Consistent sizing, spacing, and visual hierarchy
 */
export default function AppCard({
  title,
  description,
  icon,
  category,
  isRunning = false,
  isDisabled = false,
  minLevel,
  onClick,
  theme: propTheme
}: AppCardProps) {
  const { theme: currentTheme } = useTheme()
  const theme = propTheme || (currentTheme as Theme)
  const tokens = getSurfaceTokens(theme)
  const tileTokens = getTileTokens(theme)

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`
        rounded-xl border-2 p-4 transition-all duration-200
        ${isDisabled
          ? 'opacity-40 grayscale cursor-not-allowed'
          : 'hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer hover:shadow-md'
        }
        ${tokens.card}
        ${tokens.borderCard}
        ${isRunning ? 'border-blue-500/50' : ''}
      `}
    >
      {/* Icon tile */}
      <div className={`w-14 h-14 mx-auto mb-3 rounded-lg flex items-center justify-center border ${tileTokens.shadow} ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-600'
          : 'bg-slate-200 border-slate-300'
      }`}>
        {icon && icon.startsWith('/ninja-os/data/img/') ? (
          <img src={icon} alt={title} className="w-8 h-8 object-contain" />
        ) : (
          <span className="text-2xl">📱</span>
        )}
      </div>

      {/* App info - standardized spacing */}
      <h3 className={`text-sm font-bold mb-1.5 text-center leading-tight ${tokens.textPrimary}`}>
        {title}
      </h3>
      <p className={`text-xs text-center leading-snug mb-3 line-clamp-2 ${tokens.textSecondary}`}>
        {description}
      </p>

      {/* Tags - consistent with Control Tower */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          theme === 'dark'
            ? 'bg-blue-500/25 text-blue-300 border-blue-500/40'
            : 'bg-blue-100 text-blue-700 border-blue-500/50'
        }`}>
          {category.toUpperCase()}
        </span>
        {isDisabled && minLevel && (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            theme === 'dark'
              ? 'bg-red-500/25 text-red-300 border-red-500/40'
              : 'bg-red-100 text-red-600 border-red-500/50'
          }`}>
            Nível {minLevel}+
          </span>
        )}
        {isRunning && (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            theme === 'dark'
              ? 'bg-green-500/25 text-green-300 border-green-500/40'
              : 'bg-green-100 text-green-600 border-green-500/50'
          }`}>
            Em execução
          </span>
        )}
      </div>
    </button>
  )
}
