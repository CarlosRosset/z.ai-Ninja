'use client'

import { useTheme } from 'next-themes'
import { useNinjaOSStore, Favorite } from '@/stores/ninja-os'
import { useState } from 'react'
import PageHero from './shared/PageHero'
import SectionCard from './shared/SectionCard'

export default function ControlTower() {
  const { theme } = useTheme()
  const { favorites, favoritesLoading } = useNinjaOSStore()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const classifyFavorite = (item: Favorite): string => {
    const t = item.title.toLowerCase()
    const d = item.description.toLowerCase()

    if (t.includes('node') || d.includes('next.js')) return 'prod'
    if (t.includes('portainer') || d.includes('docker')) return 'ops'
    if (t.includes('cockpit') || d.includes('cpu') || d.includes('logs')) return 'mon'
    if (t.includes('hostinger') || d.includes('vps')) return 'infra'
    return 'all'
  }

  const badgeLabel = (kind: string): string => {
    const labels: Record<string, string> = {
      prod: 'Produto',
      ops: 'Gestão',
      mon: 'Monitoramento',
      infra: 'Infra',
      all: 'Todos'
    }
    return labels[kind] || 'Todos'
  }

  const filteredFavorites = favorites.filter(f => {
    const kind = classifyFavorite(f)
    const matchesFilter = filter === 'all' || kind === filter
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* PageHero - Standardized header */}
      <SectionCard padding="lg" theme={theme}>
        <PageHero
          icon="🧭"
          title="Torre de Controle"
          subtitle="Operação, rotas e ferramentas — tudo em um só lugar"
          theme={theme}
        />
      </SectionCard>

      {/* Search & Filters */}
      <SectionCard padding="md" theme={theme}>
        <div className="flex gap-3 flex-wrap items-center">
          <input
            type="text"
            placeholder="Buscar por título, descrição ou domínio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 min-w-[220px] px-4 py-2.5 rounded-lg border-2 outline-none transition-all ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-600'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white'
            }`}
          />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              filter === 'all'
                ? theme === 'dark'
                  ? 'bg-blue-500 border-blue-600 text-white shadow-md'
                  : 'bg-blue-500 border-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400/60 hover:bg-slate-600 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('prod')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              filter === 'prod'
                ? theme === 'dark'
                  ? 'bg-blue-500 border-blue-600 text-white shadow-md'
                  : 'bg-blue-500 border-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400/60 hover:bg-slate-600 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            Produto
          </button>
          <button
            onClick={() => setFilter('ops')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              filter === 'ops'
                ? theme === 'dark'
                  ? 'bg-blue-500 border-blue-600 text-white shadow-md'
                  : 'bg-blue-500 border-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400/60 hover:bg-slate-600 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            Gestão
          </button>
          <button
            onClick={() => setFilter('mon')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              filter === 'mon'
                ? theme === 'dark'
                  ? 'bg-blue-500 border-blue-600 text-white shadow-md'
                  : 'bg-blue-500 border-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400/60 hover:bg-slate-600 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            Monitoramento
          </button>
          <button
            onClick={() => setFilter('infra')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              filter === 'infra'
                ? theme === 'dark'
                  ? 'bg-blue-500 border-blue-600 text-white shadow-md'
                  : 'bg-blue-500 border-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400/60 hover:bg-slate-600 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            Infra
          </button>
        </div>
      </SectionCard>

      {/* Content */}
      {favoritesLoading ? (
        <SectionCard padding="xl" theme={theme}>
          <div className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Carregando favoritos...
          </div>
        </SectionCard>
      ) : favorites.length === 0 ? (
        <SectionCard padding="lg" theme={theme}>
          <div className="text-center">
            <div className={`font-bold text-2xl mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>
              📁
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Nenhum favorito
            </h3>
            <p className={`text-base ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Faça login e adicione seus favoritos para acessar rapidamente seus recursos mais usados.
            </p>
          </div>
        </SectionCard>
      ) : filteredFavorites.length === 0 ? (
        <SectionCard padding="lg" theme={theme}>
          <div className="text-center">
            <div className={`font-bold text-2xl mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>
              🔍
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Nada para mostrar
            </h3>
            <p className={`text-base ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Ajuste o filtro ou a busca para encontrar seus favoritos.
            </p>
          </div>
        </SectionCard>
      ) : (
        <SectionCard padding="lg" theme={theme}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((item) => {
              const kind = classifyFavorite(item)
              const badge = badgeLabel(kind)

              return (
                <div
                  key={item.id}
                  onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')}
                  className={`rounded-xl border-2 p-4 cursor-pointer hover:scale-105 transition-all hover:shadow-md min-h-[190px] flex flex-col ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-600 hover:border-blue-500/60'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-slate-100'
                  }`}
                >
                  {/* Icon tile */}
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden mb-4 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-slate-200 border-slate-300'
                  }`}>
                    {item.image ? (
                      <img src={item.image} alt="" className="w-11 h-11 object-contain" />
                    ) : (
                      <div className={`w-11 h-11 rounded ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`} />
                    )}
                  </div>

                  {/* App info */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-base truncate mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </div>
                    <div className={`text-xs font-mono truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.link.replace(/^https?:\/\//, '')}
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed line-clamp-3 flex-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description}
                  </p>

                  <div className={`flex items-center justify-between pt-3 border-t ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} mt-auto`}>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      theme === 'dark'
                        ? 'bg-blue-500/25 text-blue-300 border-blue-500/40'
                        : 'bg-blue-100 text-blue-700 border-blue-500/50'
                    }`}>
                      {badge}
                    </span>
                    <button className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                      theme === 'dark'
                        ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-sm'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}>
                      Acessar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
