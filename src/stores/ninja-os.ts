import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipos
export interface User {
  id: string
  email: string
  name: string
  role: number // 0=visitor, 1=user, 2=manager, 3=admin, 4=superadmin
  avatar?: string
  phone?: string
  createdAt?: Date
}

export interface Favorite {
  id: string
  title: string
  link: string
  description: string
  image?: string
  category?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface AuthState {
  // Auth
  user: User | null
  accessToken: string | null
  isLoggedIn: boolean
  isLoading: boolean

  // Favorites
  favorites: Favorite[]
  favoritesLoading: boolean

  // Actions - Auth
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<boolean>
  fetchMe: () => Promise<void>

  // Actions - Favorites
  fetchFavorites: () => Promise<void>
  createFavorite: (favorite: Omit<Favorite, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  deleteFavorite: (id: string) => Promise<boolean>

  // Internal
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
}

/**
 * Função helper para fazer requisições com refresh automático
 */
let isRefreshing = false

async function fetchWithRefresh(url: string, options?: RequestInit): Promise<Response> {
  const state = useNinjaOSStore.getState()

  if (!state.accessToken) {
    throw new Error('Não autenticado')
  }

  // Adicionar token ao header
  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${state.accessToken}`,
  }

  let response = await fetch(url, { ...options, headers })

  // Se 401, tenta refresh
  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true

    try {
      const refreshed = await useNinjaOSStore.getState().refreshAccessToken()

      if (refreshed) {
        // Tentar a requisição original novamente
        const newToken = useNinjaOSStore.getState().accessToken
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: newToken ? `Bearer ${newToken}` : '',
          },
        })
      }
    } finally {
      isRefreshing = false
    }
  }

  return response
}

/**
 * Store Zustand para NinjaOS
 */
export const useNinjaOSStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      accessToken: null,
      isLoggedIn: false,
      isLoading: false,
      favorites: [],
      favoritesLoading: false,

      // Setters
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Login
      login: async (email, password) => {
        set({ isLoading: true })

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok || !data.ok) {
            set({ isLoading: false })
            return false
          }

          set({
            user: data.user,
            accessToken: data.accessToken,
            isLoggedIn: true,
            isLoading: false,
          })

          // Carregar favorites após login
          await get().fetchFavorites()

          return true
        } catch (error) {
          console.error('Erro no login:', error)
          set({ isLoading: false })
          return false
        }
      },

      // Logout
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
          console.error('Erro no logout:', error)
        }

        set({
          user: null,
          accessToken: null,
          isLoggedIn: false,
          favorites: [],
        })
      },

      // Refresh access token
      refreshAccessToken: async () => {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
          })

          const data = await response.json()

          if (!response.ok || !data.ok) {
            // Refresh falhou, fazer logout
            await get().logout()
            return false
          }

          set({ accessToken: data.accessToken })
          return true
        } catch (error) {
          console.error('Erro no refresh:', error)
          await get().logout()
          return false
        }
      },

      // Buscar usuário atual
      fetchMe: async () => {
        const { accessToken } = get()

        if (!accessToken) return

        try {
          const response = await fetch('/api/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })

          const data = await response.json()

          // Se token expirou (401), silenciosamente return
          // O sistema vai pedir login na próxima interação

          if (response.ok && data.ok) {
            set({ user: data.user, isLoggedIn: true })
          }
        } catch (error) {
          console.error('Erro ao buscar usuário:', error)
        }
      },

      // Fetch favorites
      fetchFavorites: async () => {
        const { accessToken } = get()

        if (!accessToken) return

        set({ favoritesLoading: true })

        try {
          const response = await fetch('/api/favorites', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })

          const data = await response.json()

          if (response.ok && data.ok) {
            set({ favorites: data.favorites })
          }
        } catch (error) {
          console.error('Erro ao buscar favorites:', error)
        } finally {
          set({ favoritesLoading: false })
        }
      },

      // Create favorite
      createFavorite: async (favorite) => {
        const { accessToken } = get()

        if (!accessToken) return false

        try {
          const response = await fetchWithRefresh('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favorite),
          })

          const data = await response.json()

          if (response.ok && data.ok) {
            // Adicionar ao estado local
            set({ favorites: [data.favorite, ...get().favorites] })
            return true
          }

          return false
        } catch (error) {
          console.error('Erro ao criar favorite:', error)
          return false
        }
      },

      // Delete favorite
      deleteFavorite: async (id) => {
        const { accessToken } = get()

        if (!accessToken) return false

        try {
          const response = await fetchWithRefresh(`/api/favorites/${id}`, {
            method: 'DELETE',
          })

          const data = await response.json()

          if (response.ok && data.ok) {
            // Remover do estado local
            set({ favorites: get().favorites.filter(f => f.id !== id) })
            return true
          }

          return false
        } catch (error) {
          console.error('Erro ao deletar favorite:', error)
          return false
        }
      },
    }),
    {
      name: 'ninja-os-storage',
      // Persistir apenas user e accessToken (não salvar tokens sensíveis por muito tempo)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)

/**
 * Helper para fazer requisições autenticadas com refresh automático
 */
export async function authenticatedFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  return fetchWithRefresh(url, options)
}
