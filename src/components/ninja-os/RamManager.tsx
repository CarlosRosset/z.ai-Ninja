'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import PageHero from './shared/PageHero'
import SectionCard from './shared/SectionCard'

export default function RamManager() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [usage, setUsage] = useState(0)

  const mountRam = () => {
    if (mounted) return
    setMounted(true)
    setUsage(Math.floor(Math.random() * 30) + 10)
  }

  const unmountRam = () => {
    if (!mounted) return
    setMounted(false)
    setUsage(0)
  }

  return (
    <div className="space-y-6">
      {/* PageHero - Standardized header */}
      <SectionCard padding="lg" theme={theme}>
        <PageHero
          icon="🥷"
          title="Gerenciador de Disco RAM"
          subtitle="Edição Ninja Expert v6.1"
          theme={theme}
        />
      </SectionCard>

      {/* Metrics */}
      <SectionCard padding="lg" theme={theme}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status */}
          <div className={`rounded-xl border-2 p-4 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-xs uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Status
            </div>
            <div className={`text-3xl font-bold ${mounted ? 'text-green-500' : 'text-red-500'}`}>
              {mounted ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>

          {/* Memory Usage */}
          <div className={`rounded-xl border-2 p-4 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-xs uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Uso de Memória
            </div>
            <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {mounted ? usage : 0}%
            </div>
            <div className={`w-full h-2 bg-slate-950 rounded-full overflow-hidden border ${
              theme === 'dark' ? 'border-slate-600' : 'border-slate-300'
            }`}>
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${mounted ? usage : 0}%` }}
              />
            </div>
          </div>

          {/* Available */}
          <div className={`rounded-xl border-2 p-4 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-xs uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Disponível
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {mounted ? (5 - (5 * usage / 100)).toFixed(1) : 5} GB
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Controls */}
      <SectionCard padding="lg" theme={theme} className="flex gap-3 flex-wrap">
        <button
          onClick={mountRam}
          disabled={mounted}
          className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-all border-2 shadow-md ${
            mounted
              ? (theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed')
              : (theme === 'dark'
                  ? 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-sm hover:shadow-md'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md hover:shadow-lg')
          }`}
        >
          {mounted ? 'MONTADO' : 'MONTAR'}
        </button>
        <button
          onClick={unmountRam}
          disabled={!mounted}
          className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-all border-2 shadow-md ${
            !mounted
              ? (theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed')
              : (theme === 'dark'
                  ? 'bg-red-500 text-white hover:bg-red-400 shadow-sm hover:shadow-md'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg')
          }`}
        >
          DESMONTAR
        </button>
      </SectionCard>

      {/* System Log */}
      <SectionCard padding="md" theme={theme} className={`font-mono text-xs overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-700/60' : 'bg-slate-100 border-slate-200'}`}>
        <div className={`text-slate-500 ${theme === 'dark' ? 'opacity-60' : ''}`}>[SYS] Inicializado. Aguardando comando...</div>
        {mounted && (
          <>
            <div className="text-green-500">[SYS] Iniciando alocação de tmpfs...</div>
            <div className="text-green-500">[SYS] Disco RAM montado com sucesso em /mnt/build-ram</div>
          </>
        )}
      </SectionCard>
    </div>
  )
}
