/**
 * Application Launcher Icon
 *
 * Representa visualmente o conceito de "todas as janelas / todos os apps dentro de um mesmo espaço"
 * É um container visual de aplicativos para seleção rápida
 *
 * Baseado em: macOS Launchpad, Application Launcher, App Grid
 */
export default function ApplicationLauncherIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      role="img"
      aria-label="Menu de Aplicações"
      className={className}
    >
      {/* Janela / container */}
      <rect x="3.5" y="4.5" width="21" height="19" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />

      {/* Barra superior (sensação de janela) */}
      <path d="M7 9h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

      {/* 3 botões (mac-like, sem cor fixa; herda currentColor) */}
      <circle cx="8.3" cy="7.3" r="0.9" fill="currentColor" />
      <circle cx="10.9" cy="7.3" r="0.9" fill="currentColor" />
      <circle cx="13.5" cy="7.3" r="0.9" fill="currentColor" />

      {/* Grade de apps (3x3) */}
      <rect x="8" y="12" width="3" height="3" rx="0.8" fill="currentColor" />
      <rect x="12.5" y="12" width="3" height="3" rx="0.8" fill="currentColor" />
      <rect x="17" y="12" width="3" height="3" rx="0.8" fill="currentColor" />

      <rect x="8" y="16.5" width="3" height="3" rx="0.8" fill="currentColor" />
      <rect x="12.5" y="16.5" width="3" height="3" rx="0.8" fill="currentColor" />
      <rect x="17" y="16.5" width="3" height="3" rx="0.8" fill="currentColor" />

      <rect x="8" y="21" width="3" height="3" rx="0.8" fill="currentColor" />
      <rect x="12.5" y="21" width="3" height="3" rx="0.8" fill="currentColor" />
      <rect x="17" y="21" width="3" height="3" rx="0.8" fill="currentColor" />
    </svg>
  )
}
