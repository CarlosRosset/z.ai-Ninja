/**
 * Surface Tokens - Global surface definitions for Ninja OS
 * Defines consistent visual layers across all screens
 */

export const SURFACE_TOKENS = {
  dark: {
    // 3-layer visual system for dark theme
    base: 'bg-slate-900',
    panel: 'bg-slate-800',
    card: 'bg-slate-750',
    inset: 'bg-slate-700',

    // Borders aligned to surfaces
    borderBase: 'border-slate-700',
    borderPanel: 'border-slate-700',
    borderCard: 'border-slate-600',
    borderInset: 'border-slate-600',

    // Shadows - consistent across themes
    shadowPanel: 'shadow-md',
    shadowCard: 'shadow-md',
    shadowInset: 'shadow-sm',

    // Typography
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textTertiary: 'text-slate-400',
    textAccent: 'text-cyan-400',
  },
  light: {
    // 3-layer visual system for light theme
    base: 'bg-white',
    panel: 'bg-slate-50',
    card: 'bg-slate-50',
    inset: 'bg-slate-200',

    // Borders aligned to surfaces
    borderBase: 'border-slate-200',
    borderPanel: 'border-slate-200',
    borderCard: 'border-slate-200',
    borderInset: 'border-slate-300',

    // Shadows - consistent across themes
    shadowPanel: 'shadow-md',
    shadowCard: 'shadow-md',
    shadowInset: 'shadow-sm',

    // Typography
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textTertiary: 'text-slate-500',
    textAccent: 'text-cyan-600',
  },
} as const

export type Theme = 'dark' | 'light'

export const getSurfaceTokens = (theme: Theme) => SURFACE_TOKENS[theme]

// Tile icon tokens
export const TILE_TOKENS = {
  dark: {
    bg: 'bg-slate-800',
    border: 'border-slate-600',
    shadow: 'shadow-sm',
    size: 'w-12 h-12',
    iconSize: 'text-2xl',
  },
  light: {
    bg: 'bg-white',
    border: 'border-slate-200',
    shadow: 'shadow-sm',
    size: 'w-12 h-12',
    iconSize: 'text-2xl',
  },
} as const

export const getTileTokens = (theme: Theme) => TILE_TOKENS[theme]

// Density tokens
export const DENSITY = {
  padding: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  },
  gap: {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-5',
    xl: 'gap-6',
  },
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  },
} as const
