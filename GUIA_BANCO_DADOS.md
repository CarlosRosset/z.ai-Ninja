# 🗄️ Guia Completo de Configuração do Banco de Dados

---

## 📅 DATA
**18 de Janeiro de 2026**

---

## 📋 RESUMO DO BANCO DE DADOS

### **Prisma ORM**
- **ORM**: Prisma
- **Tipo de Banco**: SQLite (desenvolvimento)
- **Schema**: `prisma/schema.prisma`
- **Client**: `@prisma/client`

### **Modelos Existentes**
```prisma
- User (usuários)
- Post (posts/artigos)
```

---

## 📁 LOCALIZAÇÃO DAS CONFIGURAÇÕES

### **1. Schema do Banco de Dados**
```
📁 prisma/schema.prisma
```
Define:
- Generator (prisma-client-js)
- Datasource (sqlite)
- Models (User, Post)

### **2. Variáveis de Ambiente**
```
📁 .env
```
Contém:
```
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

### **3. Client do Prisma**
```
📁 src/lib/db.ts
```
Exporta:
```typescript
export const db = new PrismaClient({ log: ['query'] })
```

### **4. Arquivo do Banco de Dados**
```
📁 db/custom.db
```
Localização física do arquivo SQLite.

### **5. Migrations**
```
📁 prisma/migrations/
```
Histórico de alterações do schema.

---

## 🔍 CONFIGURAÇÃO ATUAL

### **Arquivo: prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Explicação:**
- **datasource**: Define o tipo de banco (SQLite)
- **DATABASE_URL**: Variável de ambiente com o caminho do arquivo
- **models**: Define as tabelas/entidades

### **Arquivo: .env**

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

**Explicação:**
- **file:** protocolo para SQLite
- **/home/z/my-project/db/custom.db**: caminho absoluto do arquivo

### **Arquivo: src/lib/db.ts**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = db
```

**Explicação:**
- **globalForPrisma**: Singleton para evitar múltiplas instâncias
- **log: ['query']**: Loga todas as queries no console
- **process.env.NODE_ENV**: Previne recriação em produção

---

## 🔧 COMO CONFIGURAR OUTRO BANCO DE DADOS

### **Opção 1: PostgreSQL (Produção)**

**1. Instalar cliente PostgreSQL:**
```bash
bun add @prisma/client
bun add -D prisma
```

**2. Atualizar schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**3. Atualizar .env:**
```env
# PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/meubanco?schema=public"

# Ou via URL de serviço (Neon, Supabase, etc.)
DATABASE_URL="postgresql://usuario:senha@host-neon.com/neondb?sslmode=require"
```

**4. Fazer push do schema:**
```bash
bunx prisma db push
```

### **Opção 2: MySQL**

**1. Instalar cliente MySQL:**
```bash
bun add @prisma/client mysql2
```

**2. Atualizar schema.prisma:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**3. Atualizar .env:**
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/meubanco"
```

**4. Fazer push do schema:**
```bash
bunx prisma db push
```

### **Opção 3: Manter SQLite (Local)**

**Já configurado!** Não precisa mudar nada.

---

## 🚀 COMANDOS DO PRISMA

### **Para Desenvolvimento:**

```bash
# Fazer push do schema (cria/atualiza tabelas)
bun run db:push

# Criar migration (histórico de alterações)
bunx prisma migrate dev --name nome_da_migration

# Gerar client Prisma
bunx prisma generate

# Abrir Prisma Studio (interface visual)
bunx prisma studio

# Resetar banco (cuidado!)
bunx prisma migrate reset
```

### **Para Produção:**

```bash
# Deploy do schema
bunx prisma migrate deploy

# Gerar client
bunx prisma generate
```

---

## 📝 EXEMPLO DE USO NO CÓDIGO

### **Exemplo 1: Criar um Usuário**

```typescript
import { db } from '@/lib/db'

// Criar usuário
const user = await db.user.create({
  data: {
    email: 'carlos@exemplo.com',
    name: 'Carlos Rosset',
  },
})

console.log(user)
```

### **Exemplo 2: Criar um Post**

```typescript
import { db } from '@/lib/db'

// Criar post
const post = await db.post.create({
  data: {
    title: 'Meu Primeiro Post',
    content: 'Conteúdo do post...',
    authorId: 'user-id',
    published: true,
  },
})

console.log(post)
```

### **Exemplo 3: Buscar Usuários**

```typescript
// Buscar todos os usuários
const users = await db.user.findMany()

// Buscar usuário por email
const user = await db.user.findUnique({
  where: { email: 'carlos@exemplo.com' },
})
```

### **Exemplo 4: Atualizar Usuário**

```typescript
const updatedUser = await db.user.update({
  where: { email: 'carlos@exemplo.com' },
  data: {
    name: 'Carlos Rosset Jr.',
  },
})
```

### **Exemplo 5: Deletar Usuário**

```typescript
await db.user.delete({
  where: { email: 'carlos@exemplo.com' },
})
```

---

## 🔐 SEGURANÇA DO BANCO DE DADOS

### **Arquivos Protegidos (no .gitignore):**
```
db/
*.db
.env
```

**Por que?**
- **db/**: Banco de dados local não deve ser versionado
- ***.db**: Arquivos de banco não devem ser compartilhados
- **.env**: Variáveis de ambiente contêm credenciais sensíveis

### **Boas Práticas:**
1. ✅ Nunca commitar arquivos .db
2. ✅ Nunca commitar arquivos .env com credenciais reais
3. ✅ Usar .env.example com configurações de exemplo
4. ✅ Em produção, usar banco de dados gerenciado (PostgreSQL, MySQL)
5. ✅ Manter migrations no controle de versão

---

## 📊 PRISMA STUDIO (Interface Visual)

### **Abrir Prisma Studio:**
```bash
cd /home/z/my-project
bunx prisma studio
```

**Acessar em:** http://localhost:5555

**Funcionalidades:**
- Visualizar dados em formato de tabela
- Criar, editar, deletar registros
- Filtrar e buscar dados
- Ver relações entre models

---

## 🎯 ESTRUTURA DE DIRETÓRIOS

```
z.ai-Ninja/
├── prisma/
│   ├── schema.prisma          ← Define models e datasource
│   └── migrations/            ← Histórico de alterações
├── db/
│   └── custom.db             ← Arquivo do banco SQLite
├── src/
│   └── lib/
│       └── db.ts             ← Client Prisma
├── .env                      ← DATABASE_URL
└── .gitignore               ← Protege db/ e .env
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- [x] Prisma configurado com SQLite
- [x] Schema definido (User, Post)
- [x] Client exportado em src/lib/db.ts
- [x] .env configurado com DATABASE_URL
- [x] Banco de dados protegido no .gitignore
- [x] Prisma client pronto para uso

---

## 📞 PRÓXIMOS PASSOS

### **Para usar o banco de dados:**

1. **Usar em APIs (Server Actions):**
```typescript
// src/app/api/users/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json(users)
}
```

2. **Criar novos models:**
- Editar `prisma/schema.prisma`
- Adicionar novos models
- Rodar `bun run db:push`

3. **Visualizar dados:**
- Abrir Prisma Studio
- Visualizar e manipular dados

---

## 📚 REFERÊNCIAS

- **Documentação Prisma**: https://www.prisma.io/docs
- **SQLite**: https://www.sqlite.org/docs.html
- **Next.js com Prisma**: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-next

---

**Data:** 18 de Janeiro de 2026
**Autor:** Z.ai Code Assistant
**Status:** ✅ CONFIGURAÇÃO COMPLETA
