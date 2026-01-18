# 🗄️ Resumo: Configuração do Banco de Dados

---

## 📊 CONFIGURAÇÃO ATUAL (Padrão do Projeto)

### **ORM e Banco de Dados**
```
ORM:     Prisma 6.11.1
Banco:   SQLite
Schema:  prisma/schema.prisma
Client:  @prisma/client 6.11.1
```

---

## 📁 ONDE FICAM AS CONFIGURAÇÕES

### **1. SCHEMA DO BANCO (Modelos)**
```
📁 prisma/schema.prisma
```
Define os modelos (tabelas):
- User (usuários)
- Post (posts/artigos)

### **2. VARIÁVEIS DE AMBIENTE**
```
📁 .env
```
Contém:
```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

**Explicação:**
- `file:` = protocolo SQLite
- `/home/z/my-project/db/custom.db` = caminho do arquivo do banco

### **3. CLIENT PRISMA**
```
📁 src/lib/db.ts
```
Exporta a instância do banco:
```typescript
export const db = new PrismaClient({ log: ['query'] })
```

### **4. ARQUIVO DO BANCO**
```
📁 db/custom.db
```
Arquivo SQLite onde os dados são salvos.

---

## 🔧 COMANDOS DISPONÍVEIS (no package.json)

```bash
bun run db:push      # Faz push do schema (cria/atualiza tabelas)
bun run db:generate   # Gera o client Prisma
bun run db:migrate    # Cria migration
bun run db:reset      # Reseta o banco (cuidado!)
```

---

## 📝 COMO USAR NO CÓDIGO

### **Importar o client:**
```typescript
import { db } from '@/lib/db'
```

### **Criar usuário:**
```typescript
const user = await db.user.create({
  data: {
    email: 'carlos@exemplo.com',
    name: 'Carlos Rosset',
  },
})
```

### **Buscar usuários:**
```typescript
const users = await db.user.findMany()
```

### **Criar post:**
```typescript
const post = await db.post.create({
  data: {
    title: 'Título do Post',
    content: 'Conteúdo...',
    authorId: 'user-id',
    published: true,
  },
})
```

---

## 🎯 PRISMA STUDIO (Interface Visual)

### **Abrir interface visual:**
```bash
bunx prisma studio
```

**Acessar em:** http://localhost:5555

---

## 🔐 SEGURANÇA

### **Arquivos protegidos (.gitignore):**
```
db/
*.db
.env
```

**Por que?**
- O banco de dados local não deve ser versionado
- O .env contém credenciais sensíveis

---

## 📊 MODELOS DEFINIDOS

### **User:**
```typescript
{
  id: string        // @id @default(cuid())
  email: string     // @unique
  name?: string
  createdAt: DateTime // @default(now())
  updatedAt: DateTime // @updatedAt
}
```

### **Post:**
```typescript
{
  id: string        // @id @default(cuid())
  title: string
  content?: string
  published: boolean // @default(false)
  authorId: string
  createdAt: DateTime // @default(now())
  updatedAt: DateTime // @updatedAt
}
```

---

## 📚 EXEMPLO PRÁTICO COMPLETO

### **API Route (Server Action):**

```typescript
// src/app/api/users/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET - Buscar todos os usuários
export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json(users)
}

// POST - Criar usuário
export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  })
  return NextResponse.json(user)
}
```

---

## ✅ CHECKLIST

- [x] Prisma configurado
- [x] Schema definido (User, Post)
- [x] Client exportado em src/lib/db.ts
- [x] .env configurado com DATABASE_URL
- [x] Banco protegido no .gitignore
- [x] Comandos configurados no package.json

---

## 🚀 PARA COMEÇAR A USAR:

1. **Criar novos models** (se necessário):
   - Editar `prisma/schema.prisma`
   - Adicionar models
   - Rodar `bun run db:push`

2. **Usar no código**:
   - Importar: `import { db } from '@/lib/db'`
   - Usar: `await db.user.create(...)`

3. **Visualizar dados**:
   - Abrir Prisma Studio: `bunx prisma studio`
   - Acessar: http://localhost:5555

---

**Guia completo:** Veja `GUIA_BANCO_DADOS.md`
