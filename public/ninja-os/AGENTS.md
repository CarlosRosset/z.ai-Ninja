# AGENTS - Ninja OS POC

## Propósito

Orientar agentes/colaboradores sobre o contexto da POC **Ninja OS** e práticas
de colaboração no ambiente Next.js full-stack.

## Contexto rápido

- Ninja OS: interface Mac-like web, com barra superior, doca inferior e janelas.
- Apps Ninja: majoritariamente internos; iframes externos são raros.
- Janela maximizada deve respeitar a barra superior (encostar sem sobrepor);
  "always on top" só se for impossível respeitar a barra.
- Foco único por vez; ícones na doca indicam apps abertos, mesmo ocultos.

## Arquitetura Next.js

A POC foi migrada para um ambiente Next.js 15 com:
- **App Router**: Rotas definidas em `src/app/`
- **Server Actions**: Backend em `src/app/api/`
- **Prisma ORM**: Banco de dados SQLite
- **shadcn/ui**: Componentes UI reutilizáveis
- **next-themes**: Gerenciamento de temas (dark/light)
- **Zustand**: Gerenciamento de estado global

## Convenções de arquivos

### Estrutura de dados JSON (pasta `public/ninja-os/data/`)
- `apps.json`: Configuração dos apps disponíveis na doca
- `favorites.json`: Atalhos e links favoritos da Control Tower
- `users.json`: Usuários de teste (para desenvolvimento)

### Imagens
- Pasta: `public/ninja-os/data/img/`
- Formatos preferidos: SVG (ícones), PNG (imagens com fundo)

### Código Frontend
- Página principal: `src/app/page.tsx`
- Componentes: `src/components/ninja-os/`
- Hooks customizados: `src/hooks/ninja-os/`

### Backend API
- Rotas: `src/app/api/ninja-os/[route]/route.ts`
- Server actions para operações sensíveis

## Idioma e UX

- PT-BR em labels, mensagens e tooltips.
- Visual e padrões inspirados em macOS (botões coloridos, doca, barra superior).
- Temas: dark (padrão), light, auto (seguir sistema)

## Backlog imediato (resumo)

- [x] Migrar estrutura de arquivos JSON para Next.js
- [x] Configurar sistema de autenticação
- [ ] Implementar cadastro de usuários com persistência no banco
- [ ] Migrar interface HTML vanilla para React/Next.js
- [ ] Integrar controle de janelas com React state
- [ ] Implementar sistema de permissões por nível
- [ ] Criar API para gerenciamento de favoritos

## Credenciais de teste

### Usuário Administrador (Nível 3)
- Email: carlosrosset@gmail.com
- Senha: 12345

### Usuário Padrão (Nível 2)
- Email: ninja@os.com
- Senha: 1234

### Visitante (Nível 1)
- Email: visitante@os.com
- Senha: 123

## Como colaborar

1. Leia `ideia.txt` para entender a visão completa do projeto.
2. Use os componentes shadcn/ui disponíveis em `src/components/ui/`
3. Mantenha mensagens e labels em PT-BR.
4. Siga o padrão de código TypeScript strict.
5. Para alterações no banco, atualize `prisma/schema.prisma` e rode `bun run db:push`.
6. Teste usando `bun run dev` em http://localhost:3000

## Melhorias planejadas

### Frontend
- Migrar JavaScript vanilla para React hooks
- Usar Framer Motion para animações
- Implementar drag-and-drop de janelas
- Melhor responsividade mobile

### Backend
- Migrar dados JSON para banco de dados via Prisma
- Implementar autenticação robusta com NextAuth.js
- Criar APIs RESTful para todos os recursos
- Adicionar validação de dados com Zod

### UX/UI
- Melhorar acessibilidade (ARIA, keyboard navigation)
- Adicionar loading states e skeletons
- Implementar notificações toast para feedback
- Otimizar performance com React.memo e lazy loading
