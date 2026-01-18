'use client'

import { useTheme } from 'next-themes'

interface SettingsProps {
  showThemeSwitcher: boolean
  setShowThemeSwitcher: (show: boolean) => void
}

export default function Settings({ showThemeSwitcher, setShowThemeSwitcher }: SettingsProps) {
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      {/* Header - Problem 4 fix: More prominent with stronger borders */}
      <div className={`rounded-xl border-2 p-6 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-700 shadow-md'
          : 'bg-white border-slate-200 shadow-lg'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
            theme === 'dark'
              ? 'bg-slate-700'
              : 'bg-slate-200'
          } shadow-lg`}>
            <span className="text-4xl">⚙️</span>
          </div>
          <div>
            <h1 className={`text-xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Preferências
            </h1>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Personalize sua experiência Ninja OS
            </p>
          </div>
        </div>
      </div>

      {/* Configurações - Problems 1,2,3,8 fixes */}
      <div className={`rounded-xl border-2 overflow-hidden ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 shadow-md'
          : 'bg-white border-slate-200 shadow-md'
      }`}>
        {/* Seletor de tema */}
        <div className={`p-5 flex items-center justify-between border-b ${
          theme === 'dark' ? 'border-slate-600' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`font-medium mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Exibir Seletor de Tema
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Mostra o widget de tema na barra superior.
            </p>
          </div>
          <button
            onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
            className={`w-12 h-6 rounded-full relative transition-colors shadow-sm ${
              showThemeSwitcher
                ? (theme === 'dark'
                    ? 'bg-blue-500 shadow-md'
                    : 'bg-blue-500 shadow-md')
                : (theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600 shadow-sm'
                    : 'bg-slate-200 hover:bg-slate-300 shadow-sm')
            }`}
            aria-pressed={showThemeSwitcher}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                showThemeSwitcher ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Sons do sistema */}
        <div className="p-5 flex items-center justify-between">
          <div>
            <h3 className={`font-medium mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Sons do Sistema
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Reproduzir sons de interface.
            </p>
          </div>
          <button
            disabled
            className={`w-12 h-6 rounded-full relative transition-colors shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
            aria-label="Sons do sistema desativados"
          >
            <div className="absolute top-1 w-4 h-4 rounded-full bg-slate-400 shadow-sm translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
