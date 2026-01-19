// Ninja OS - VERSÃO FINAL CORRIGIDA - DoD Compliance
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useNinjaOSStore, authenticatedFetch } from '@/stores/ninja-os'
import ControlTower from '@/components/ninja-os/ControlTower'
import RamManager from '@/components/ninja-os/RamManager'
import Settings from '@/components/ninja-os/Settings'
import ApplicationLauncherIcon from '@/components/ninja-os/ApplicationLauncherIcon'
import PageHero from '@/components/ninja-os/shared/PageHero'
import SectionCard from '@/components/ninja-os/shared/SectionCard'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface App {
  id: string
  titulo: string
  descricao: string
  img: string
  windowId: string
  dockId: string
  nivelMinimo: number
  categoria: string
}

interface Window {
  id: string
  appId: string
  title: string
  visible: boolean
  minimized: boolean
  maximized: boolean
  focused: boolean
  zIndex: number
}

// Apps estáticos (do JSON público, para visitantes)
const STATIC_APPS: App[] = [
  {
    id: 'tower',
    titulo: 'Torre de Controle',
    descricao: 'Operação, rotas e ferramentas — tudo em um só lugar',
    img: '/ninja-os/data/img/control-tower.png',
    windowId: 'win-tower',
    dockId: 'icon-tower',
    nivelMinimo: 0,
    categoria: 'gestao'
  },
  {
    id: 'ram',
    titulo: 'Gerenciador de Disco RAM',
    descricao: 'Edição Ninja Expert v6.1',
    img: '/ninja-os/data/img/ram-chip.png',
    windowId: 'win-ram',
    dockId: 'icon-ram',
    nivelMinimo: 3, // Admin only
    categoria: 'infra'
  },
  {
    id: 'settings',
    titulo: 'Configurações do Sistema',
    descricao: 'Preferências e personalização',
    img: '/ninja-os/data/img/settings-gear.svg',
    windowId: 'win-settings',
    dockId: 'icon-settings',
    nivelMinimo: 0,
    categoria: 'sistema'
  }
]

export default function NinjaOS() {
  const { theme: themeState, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState('')

  const theme = (themeState === 'light' || resolvedTheme === 'light') ? 'light' : 'dark'

  // Store
  const {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    fetchMe,
  } = useNinjaOSStore()

  // Estado local
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAppLauncher, setShowAppLauncher] = useState(false)
  const [appLauncherMaximized, setAppLauncherMaximized] = useState(false)
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(true)
  const [windows, setWindows] = useState<Window[]>([])
  const [zIndexCounter, setZIndexCounter] = useState(100)
  const [focusedApp, setFocusedApp] = useState('Início')

  // Modais de login
  const [showRecoverModal, setShowRecoverModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [recoverEmail, setRecoverEmail] = useState('')
  const [signupData, setSignupData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    avatar: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Estado de loading para ações
  const [isRecovering, setIsRecovering] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Clock
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load user session on mount (APENAS uma vez)
  useEffect(() => {
    setMounted(true)
    fetchMe()
  }, [])

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('user-menu-popover')
      const trigger = document.getElementById('user-avatar-trigger')
      if (showUserMenu && menu && trigger && !menu.contains(e.target as Node) && !trigger.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  // Global error handler para capturar erros não tratados
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault()
      toast.error('Erro não esperado', {
        description: event.error?.message || 'Ocorreu um erro no sistema.',
      })
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // Resetar estado maximized ao abrir/fechar o App Launcher
  useEffect(() => {
    if (!showAppLauncher) {
      setAppLauncherMaximized(false)
    }
  }, [showAppLauncher])

  // Atualizar focusedApp quando launcher está aberto
  useEffect(() => {
    if (showAppLauncher) {
      setFocusedApp('Menu de Aplicações')
    }
  }, [showAppLauncher])

  // Apps ativos baseados no login
  const apps = STATIC_APPS

  // Window management
  const openWindow = (app: App) => {
    const userRole = user?.role || 0
    if (userRole < app.nivelMinimo) {
      toast.error('Acesso restrito', {
        description: `Este app requer nível ${app.nivelMinimo}. Seu nível atual: ${userRole}`,
      })
      return
    }

    setWindows(prev => {
      const existing = prev.find(w => w.appId === app.id)
      if (existing) {
        setZIndexCounter(c => c + 1)
        return prev.map(w =>
          w.id === existing.id
            ? { ...w, visible: true, minimized: false, focused: true, zIndex: zIndexCounter + 1 }
            : { ...w, focused: false }
        )
      }

      const newWindow: Window = {
        id: app.windowId,
        appId: app.id,
        title: app.titulo,
        visible: true,
        minimized: false,
        maximized: false,
        focused: true,
        zIndex: Math.max(0, ...windows.map(w => w.zIndex)) + 1
      }

      return [...prev.map(w => ({ ...w, focused: false })), newWindow]
    })
  }

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId))
    // Atualizar focusedApp se fechou a janela focada
    const remainingWindows = windows.filter(w => w.id !== windowId)
    if (remainingWindows.length === 0) {
      setFocusedApp('Início')
    }
  }

  const minimizeWindow = (windowId: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, minimized: true, focused: false }
          : w
      )
    )
    // Atualizar focusedApp
    const remainingFocused = windows.filter(w => w.id !== windowId && w.focused)
    if (remainingFocused.length === 0) {
      setFocusedApp('Início')
    }
  }

  const toggleMaximize = (windowId: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, maximized: !w.maximized }
          : w
      )
    )
  }

  // App Launcher window management (mesmo comportamento das janelas)
  const minimizeAppLauncher = () => {
    setShowAppLauncher(false)
    setFocusedApp('Início')
  }

  const toggleAppLauncherMaximize = () => {
    setAppLauncherMaximized(prev => !prev)
  }

  const focusWindow = (windowId: string) => {
    setZIndexCounter(c => c + 1)
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, minimized: false, focused: true, zIndex: zIndexCounter + 1 }
          : { ...w, focused: false }
      )
    )
    // Atualizar focusedApp
    const win = windows.find(w => w.id === windowId)
    if (win) {
      const app = apps.find(a => a.id === win.appId)
      if (app) {
        setFocusedApp(app.titulo)
      }
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Campos obrigatórios', {
        description: 'Preencha email e senha.',
      })
      return
    }

    const success = await login(email, password)
    if (!success) {
      toast.error('Erro no login', {
        description: 'Email ou senha incorretos.',
      })
    } else {
      setEmail('')
      setPassword('')
      toast.success('Bem-vindo de volta!', {
        description: `Login realizado com sucesso para ${user?.name}.`,
      })
    }
  }

  const handleLogout = async () => {
    await logout()
    setWindows([])
    setShowUserMenu(false)
    toast.success('Você saiu do sistema', {
      description: 'Volte sempre que precisar.',
    })
  }

  const handleRecover = async () => {
    if (!recoverEmail || !recoverEmail.includes('@')) {
      toast.error('Email inválido', {
        description: 'Informe um email válido para recuperação.',
      })
      return
    }

    setIsRecovering(true)

    try {
      const response = await authenticatedFetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoverEmail }),
      })

      const data = await response.json()

      if (data.ok) {
        toast.success('Email de recuperação enviado', {
          description: `Instruções de recuperação enviadas para ${recoverEmail}. Verifique sua caixa de entrada.`,
        })
        setRecoverEmail('')
        setShowRecoverModal(false)
      } else {
        toast.error('Erro ao enviar email', {
          description: data.error || 'Tente novamente mais tarde.',
        })
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação', {
        description: 'Verifique sua conexão.',
      })
    } finally {
      setIsRecovering(false)
    }
  }

  const handleSignup = async () => {
    if (!signupData.nome || !signupData.email || !signupData.telefone || !signupData.senha) {
      toast.error('Campos obrigatórios', {
        description: 'Preencha todos os campos.',
      })
      return
    }

    if (signupData.senha.length < 6) {
      toast.error('Senha muito curta', {
        description: 'A senha deve ter pelo menos 6 caracteres.',
      })
      return
    }

    setIsSigningUp(true)

    try {
      const response = await authenticatedFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.nome,
          email: signupData.email,
          phone: signupData.telefone,
          password: signupData.senha,
          avatar: signupData.avatar,
        }),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        toast.success('Cadastro realizado com sucesso!', {
          description: 'Sua conta foi criada com nível 2 (Usuário).',
        })
        setSignupData({ nome: '', email: '', telefone: '', senha: '', avatar: '' })
        setShowSignupModal(false)
      } else {
        toast.error('Erro no cadastro', {
          description: data.error || 'Não foi possível criar a conta.',
        })
      }
    } catch (error) {
      toast.error('Erro ao processar cadastro', {
        description: 'Verifique sua conexão.',
      })
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Campos obrigatórios', {
        description: 'Preencha todos os campos.',
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Senha muito curta', {
        description: 'A senha deve ter pelo menos 6 caracteres.',
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Senhas não conferem', {
        description: 'A nova senha e a confirmação devem ser iguais.',
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await authenticatedFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        toast.success('Senha alterada com sucesso!', {
          description: 'Sua senha foi atualizada. Faça login novamente.',
        })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setShowChangePasswordModal(false)
        await logout()
      } else {
        toast.error('Erro ao alterar senha', {
          description: data.error || 'A senha atual está incorreta.',
        })
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação', {
        description: 'Verifique sua conexão.',
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    toast.success(`Tema alterado para ${newTheme === 'dark' ? 'Escuro' : 'Claro'}`, {
      description: 'O tema foi aplicado.',
    })
  }

  if (!mounted) return null

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark'
          ? 'bg-linear-to-br from-slate-950 to-slate-900'
          : 'bg-linear-to-br from-slate-100 to-slate-200'
      }`}>
        <div className={`w-full max-w-md backdrop-blur-xl border rounded-2xl p-8 ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-4xl shadow-lg">
              🥷
            </div>
            <div className="text-center">
              <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>Usuário Ninja</h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'}`}>Faça login para acessar o sistema</p>
            </div>
            <div className="w-full space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className={`${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-slate-50 border-slate-300 text-foreground'
                  }`}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className={`${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-slate-50 border-slate-300 text-foreground'
                  }`}
                />
              </div>
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
            <div className={`flex flex-col gap-2 text-sm text-center ${
              theme === 'dark' ? '' : 'text-foreground'
            }`}>
              <button
                onClick={() => setShowRecoverModal(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Esqueceu sua senha?
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Criar nova conta
              </button>
            </div>
            <div className={`text-sm text-center mt-4 p-3 rounded-lg ${
              theme === 'dark'
                ? 'text-slate-400 bg-white/5'
                : 'text-muted-foreground bg-slate-100 border border-slate-200'
            }`}>
              <p className="mb-2">Credenciais de teste:</p>
              <p className="text-blue-400 font-medium">admin@ninja.local / admin123</p>
              <p className="text-green-400 font-medium">user@ninja.local / user123</p>
            </div>
          </div>
        </div>

        {/* Recover Modal */}
        <Dialog open={showRecoverModal} onOpenChange={setShowRecoverModal}>
          <DialogContent className={`${
            theme === 'dark'
              ? 'bg-slate-900 border-white/10 text-white'
              : 'bg-white border-slate-200'
          }`}>
            <DialogHeader>
              <DialogTitle>Recuperar acesso</DialogTitle>
              <DialogDescription className={`${
                theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
              }`}>
                Informe seu email para receber as instruções de recuperação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="rec-email">Email</Label>
                <Input
                  id="rec-email"
                  type="email"
                  placeholder="email@dominio.com"
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  disabled={isRecovering}
                  className={`${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20'
                      : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowRecoverModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRecover} disabled={isRecovering} className="bg-blue-500 hover:bg-blue-600">
                {isRecovering ? 'Enviando...' : 'Enviar instruções'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Signup Modal */}
        <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
          <DialogContent className={`${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-700 text-white'
              : 'bg-white border-slate-200'
          } max-w-2xl`}>
            <DialogHeader>
              <DialogTitle>Criar nova conta</DialogTitle>
              <DialogDescription className={`${
                theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
              }`}>
                Preencha os dados para um usuário nível <span className="text-blue-400 font-medium">2 - Usuário</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="su-nome">Nome completo</Label>
                  <Input
                    id="su-nome"
                    placeholder="Ex: Maria Souza"
                    value={signupData.nome}
                    onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                    disabled={isSigningUp}
                    className={`${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-600'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input
                    id="su-email"
                    type="email"
                    placeholder="email@dominio.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    disabled={isSigningUp}
                    className={`${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-600'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="su-telefone">Telefone</Label>
                  <Input
                    id="su-telefone"
                    placeholder="11999999999"
                    value={signupData.telefone}
                    onChange={(e) => setSignupData({ ...signupData, telefone: e.target.value })}
                    disabled={isSigningUp}
                    className={`${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-600'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="su-senha">Senha</Label>
                  <Input
                    id="su-senha"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.senha}
                    onChange={(e) => setSignupData({ ...signupData, senha: e.target.value })}
                    disabled={isSigningUp}
                    className={`${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-600'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="su-avatar">Avatar (URL)</Label>
                <Input
                  id="su-avatar"
                  placeholder="https://.../imagem.png"
                  value={signupData.avatar}
                  onChange={(e) => setSignupData({ ...signupData, avatar: e.target.value })}
                  disabled={isSigningUp}
                  className={`${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20'
                      : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowSignupModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSignup} disabled={isSigningUp} className="bg-blue-500 hover:bg-blue-600">
                {isSigningUp ? 'Cadastrando...' : 'Continuar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Desktop environment
  return (
    <div className={`min-h-screen relative ${
      theme === 'dark'
        ? 'bg-linear-to-br from-slate-950 to-slate-900'
        : 'bg-linear-to-br from-slate-100 to-slate-200'
    }`}>
      {/* Menu Bar */}
      <div className={`fixed top-0 left-0 right-0 h-8 backdrop-blur-md border-b flex items-center justify-between px-5 z-50 ${
        theme === 'dark'
          ? 'bg-white/10 border-white/10'
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (showAppLauncher) {
                setFocusedApp('Início')
              }
              setShowAppLauncher(!showAppLauncher)
            }}
            className="cursor-pointer"
            aria-label="Menu de Aplicações"
          >
            <ApplicationLauncherIcon className={`text-lg opacity-90 transition-transform ${showAppLauncher ? 'scale-110' : ''}`} />
          </button>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{focusedApp}</span>
        </div>
        <div className="flex items-center gap-4">
          {showThemeSwitcher && (
            <div className={`flex gap-1 p-0.5 rounded-md ${
              theme === 'dark' ? 'bg-black/20' : 'bg-slate-200'
            }`}>
              <button
                onClick={() => toggleTheme('dark')}
                className={`px-2 py-0.5 text-xs rounded flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-blue-500/30 text-blue-400'
                    : 'hover:bg-slate-300 hover:text-foreground text-muted-foreground'
                }`}
                title="Escuro"
              >
                🌑
              </button>
              <button
                onClick={() => toggleTheme('light')}
                className={`px-2 py-0.5 text-xs rounded flex items-center justify-center ${
                  theme === 'light'
                    ? 'bg-blue-500/30 text-blue-400'
                    : 'hover:bg-slate-300 hover:text-foreground text-muted-foreground'
                }`}
                title="Claro"
              >
                🌕
              </button>
            </div>
          )}
          <div className={`text-sm font-mono font-semibold opacity-90 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{time}</div>
          <div className="relative">
            <div
              id="user-avatar-trigger"
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg ${
                user?.avatar ? 'overflow-hidden' : 'bg-blue-500'
              }`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                '🥷'
              )}
            </div>
            {showUserMenu && (
              <div
                id="user-menu-popover"
                className={`absolute right-0 top-10 w-48 backdrop-blur-xl border rounded-lg shadow-md overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className={`p-3 text-sm ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
                  👤 {user?.name}
                </div>
                <div className={`border-t ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'}`}></div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    setShowChangePasswordModal(true)
                  }}
                  className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'text-slate-200 hover:bg-slate-700'
                      : 'text-foreground hover:bg-slate-100'
                  }`}
                >
                  🔒 Trocar Senha
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Windows */}
      {windows.map(window => {
        const app = apps.find(a => a.id === window.appId)
        if (!app || !window.visible) return null

        const isFocused = window.focused
        const isMaximized = window.maximized

        return (
          <div
            key={window.id}
            className={`fixed backdrop-blur-xl border rounded-xl shadow-md transition-all duration-200 overflow-hidden flex flex-col ${
              isMaximized ? 'top-8 left-0 right-0 bottom-16 rounded-none' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[640px]'
            } ${window.minimized ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'} ${
              theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white'
            } ${
              isFocused
                ? (theme === 'dark' ? 'border-cyan-400/50' : 'border-blue-500/50')
                : (theme === 'dark' ? 'border-slate-700' : 'border-slate-300')
            }`}
            style={{ zIndex: window.zIndex }}
            onMouseDown={() => focusWindow(window.id)}
          >
            {/* Window Header */}
            <div className={`h-10 border-b flex items-center px-4 justify-between shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600'
                : 'bg-slate-100 border-slate-300'
            }`}>
              <div className="flex gap-2">
                <button
                  onClick={() => closeWindow(window.id)}
                  className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity"
                  title="Fechar"
                />
                <button
                  onClick={() => minimizeWindow(window.id)}
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:opacity-80 transition-opacity"
                  title="Minimizar"
                />
                <button
                  onClick={() => toggleMaximize(window.id)}
                  className="w-3 h-3 rounded-full bg-green-500 hover:opacity-80 transition-opacity"
                  title="Maximizar"
                />
              </div>
              <div className={`text-sm font-medium ${
                isFocused
                  ? (theme === 'dark' ? 'text-white' : 'text-foreground')
                  : (theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground')
              }`}>{app.titulo}</div>
              <div className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{app.windowId}</div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {app.id === 'tower' && <ControlTower />}
              {app.id === 'ram' && <RamManager />}
              {app.id === 'settings' && <Settings showThemeSwitcher={showThemeSwitcher} setShowThemeSwitcher={setShowThemeSwitcher} />}
            </div>
          </div>
        )
      })}

      {/* Application Launcher Modal */}
      {showAppLauncher && (
        <div
          className={`fixed z-60 flex items-center justify-center ${
            appLauncherMaximized ? 'w-full top-8 left-0 right-0 bottom-0' : 'inset-0 p-8'
          }`}
          onClick={() => setShowAppLauncher(false)}
        >
          {/* BASE - Fundo do modal - usando token 'base' do surface-tokens.ts */}
          <div
            onMouseDown={() => setFocusedApp('Menu de Aplicações')}
            className={`backdrop-blur-xl border rounded-xl shadow-md transition-all duration-200 overflow-hidden flex flex-col ${
              appLauncherMaximized ? 'rounded-none w-full h-full' : 'max-w-4xl w-full max-h-[80vh]'
            } ${
              appLauncherMaximized
                ? (theme === 'dark' ? 'border-cyan-400/50' : 'border-blue-500/50')
                : (theme === 'dark' ? 'border-slate-700' : 'border-slate-300')
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* WindowChrome - IGUAL às janelas da Torre/RAM */}
            <div className={`h-10 border-b flex items-center px-4 justify-between shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600'
                : 'bg-slate-100 border-slate-300'
            }`}>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAppLauncher(false)}
                  className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity"
                  title="Fechar"
                />
                <button
                  onClick={minimizeAppLauncher}
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:opacity-80 transition-opacity"
                  title="Minimizar"
                />
                <button
                  onClick={toggleAppLauncherMaximize}
                  className="w-3 h-3 rounded-full bg-green-500 hover:opacity-80 transition-opacity"
                  title="Maximizar"
                />
              </div>
              <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Menu de Aplicações
              </div>
              <div className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                APP-LAUNCHER
              </div>
            </div>

            {/* Content - usando SectionCard padrão do sistema */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* PANEL 1 - Hero Section - usando PageHero padrão */}
              <SectionCard padding="lg" theme={theme}>
                <PageHero
                  icon="🚀"
                  title="Todos os Apps"
                  subtitle="Aplicações disponíveis para sua conta"
                  theme={theme}
                />
              </SectionCard>

              {/* PANEL 2 - App Grid Section - usando SectionCard padrão */}
              <SectionCard padding="lg" theme={theme}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {apps.map((app) => {
                    const isRunning = windows.some(w => w.appId === app.id)
                    const isDisabled = Boolean(user && user.role < app.nivelMinimo)

                    return (
                      <button
                        key={app.id}
                        onClick={() => {
                          if (!isDisabled) {
                            openWindow(app)
                            setShowAppLauncher(false)
                          }
                        }}
                        disabled={!!isDisabled}
                        className={`
                          rounded-xl border-2 p-4 transition-all duration-200
                          ${isDisabled
                            ? 'opacity-40 grayscale cursor-not-allowed'
                            : 'hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer hover:shadow-md'
                          }
                          ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 hover:border-blue-500/60'
                              : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-slate-100'
                          }
                          ${isRunning ? 'border-blue-500/50' : ''}
                        `}
                      >
                        {/* Icon tile - PERCEPTIBLE DEGREE from card background */}
                        <div className={`w-14 h-14 mx-auto mb-3 rounded-lg flex items-center justify-center border shadow-sm ${
                          theme === 'dark'
                            ? 'bg-slate-800 border-slate-600'
                            : 'bg-slate-100 border-slate-200'
                        }`}>
                          {app.img && app.img.startsWith('/ninja-os/data/img/') ? (
                            <img src={app.img} alt={app.titulo} className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="text-2xl">📱</span>
                          )}
                        </div>

                        {/* App info */}
                        <h3 className={`text-sm font-bold mb-1.5 text-center leading-tight ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {app.titulo}
                        </h3>
                        <p className={`text-xs text-center leading-snug mb-3 line-clamp-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {app.descricao}
                        </p>

                        {/* Tags */}
                        <div className="flex gap-1.5 justify-center flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            theme === 'dark'
                              ? 'bg-blue-500/25 text-blue-300 border-blue-500/40'
                              : 'bg-blue-100 text-blue-700 border-blue-500/50'
                          }`}>
                            {app.categoria.toUpperCase()}
                          </span>
                          {isDisabled && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              theme === 'dark'
                                ? 'bg-red-500/25 text-red-300 border-red-500/40'
                                : 'bg-red-100 text-red-600 border-red-500/50'
                            }`}>
                              Nível {app.nivelMinimo}+
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
                  })}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      )}
      {/* Dock */}
      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 backdrop-blur-xl border rounded-2xl px-4 py-3 flex gap-3 shadow-md z-40 ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white/80 border-slate-300'
      }`}>
        {apps.map(app => {
          const isRunning = windows.some(w => w.appId === app.id)
          const isDisabled = Boolean(user && user.role < app.nivelMinimo)

          return (
            <button
              key={app.id}
              onClick={() => openWindow(app)}
              disabled={!!isDisabled}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:-translate-y-1 hover:scale-105 cursor-pointer'
              } border shadow-md relative ${
                theme === 'dark'
                  ? 'bg-linear-to-br from-slate-700 to-slate-800 border-slate-600'
                  : 'bg-linear-to-br from-slate-100 to-slate-200 border-slate-300'
              } ${isRunning ? 'after:content-["" ] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-2.5 after:h-2.5 after:rounded-full after:bg-green-500 after:shadow-[0_0_10px_rgba(34,197,94,0.7)]' : ''}`}
              title={app.titulo}
            >
              <img src={app.img} alt={app.titulo} className="w-9 h-9 object-contain" />
            </button>
          )
        })}
      </div>

      {/* Change Password Modal */}
      <Dialog open={showChangePasswordModal} onOpenChange={setShowChangePasswordModal}>
        <DialogContent
          className={`${
            theme === 'dark'
              ? 'bg-slate-900 border-white/10 text-white'
              : 'bg-white border-slate-200'
          } max-w-md`}
          style={{ zIndex: 100 }}
        >
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription className={`${
              theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
            }`}>
              Digite sua senha atual e defina uma nova senha.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="cp-current">Senha Atual</Label>
              <Input
                id="cp-current"
                type="password"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                disabled={isChangingPassword}
                className={`${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/20'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <Label htmlFor="cp-new">Nova Senha</Label>
              <Input
                id="cp-new"
                type="password"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                disabled={isChangingPassword}
                className={`${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/20'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <Label htmlFor="cp-confirm">Confirmar Nova Senha</Label>
              <Input
                id="cp-confirm"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                disabled={isChangingPassword}
                onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                className={`${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/20'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowChangePasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={isChangingPassword} className="bg-blue-500 hover:bg-blue-600">
              {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
