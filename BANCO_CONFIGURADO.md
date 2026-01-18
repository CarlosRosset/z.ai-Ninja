# ✅ CONFIGURAÇÃO DO BANCO DE DADOS - PRONTO PARA USO!

---

## 📊 CONFIGURAÇÃO PADRÃO (JÁ INSTALADO)

### **Banco de Dados:**
- **ORM**: Prisma 6.11.1
- **Tipo**: SQLite (desenvolvimento)
- **Arquivo**: `db/custom.db`
- **Schema**: `prisma/schema.prisma`
- **Client**: `@prisma/client`

---

## 📁 ONDE FICAM AS CONFIGURAÇÕES (4 ARQUIVOS)

### **1. 📁 prisma/schema.prisma**
**Define os modelos (tabelas):**
- User (usuários)
- Post (posts/artigos)

### **2. 📁 .env**
**Variáveis de ambiente:**
```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

### **3. 📁 src/lib/db.ts**
**Client Prisma (exportado):**
```typescript
export const db = new PrismaClient({ log: ['query'] })
```

### **4. 📁 db/custom.db**
**Arquivo físico do banco SQLite:**
- Local onde os dados são salvos
- Protegido no .gitignore (não é commitado)

---

## 🔧 COMANDOS DISPONÍVEIS

### **Para Desenvolvimento:**
```bash
bun run db:push       # Faz push do schema (cria/atualiza tabelas)
bun run db:generate    # Gera o client Prisma
bun run db:migrate     # Cria migration
bun run db:reset       # Reseta o banco (cuidado!)
bunx prisma studio     # Abre interface visual
```

---

## 📝 COMO USAR NO CÓDIGO (Exemplos Práticos)

### **Importar o banco:**
```typescript
import { db } from '@/lib/db'
```

### **1. Criar um Usuário:**
```typescript
const user = await db.user.create({
  data: {
    email: 'carlos@exemplo.com',
    name: 'Carlos Rosset',
  },
})
```

### **2. Buscar Todos os Usuários:**
```typescript
const users = await db.user.findMany()
```

### **3. Buscar Usuário por Email:**
```typescript
const user = await db.user.findUnique({
  where: { email: 'carlos@exemplo.com' },
})
```

### **4. Atualizar Usuário:**
```typescript
const updatedUser = await db.user.update({
  where: { email: 'carlos@exemplo.com' },
  data: {
    name: 'Carlos Rosset Jr.',
  },
})
```

### **5. Deletar Usuário:**
```typescript
await db.user.delete({
  where: { email: 'carlos@exemplo.com' },
})
```

### **6. Criar um Post:**
```typescript
const post = await db.post.create({
  data: {
    title: 'Meu Primeiro Post',
    content: 'Conteúdo do post...',
    authorId: 'user-id-here',
    published: true,
  },
})
```

### **7. Buscar Posts de um Usuário:**
```typescript
const posts = await db.post.findMany({
  where: { authorId: 'user-id-here' },
})
```

---

## 🎯 EXEMPLO COMPLETO DE API

### **src/app/api/users/route.ts:**
```typescript
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET - Buscar todos os usuários
export async function GET() {
  try {
    const users = await db.user.findMany()
    return NextResponse.json({ success: true, users })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar usuários' },
      { status: 500 }
    )
  }
}

// POST - Criar usuário
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await db.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}
```

### **Como usar (frontend):**
```typescript
// Buscar usuários
const response = await fetch('/api/users')
const data = await response.json()

// Criar usuário
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'novo@exemplo.com',
    name: 'Novo Usuário',
  }),
})
```

---

## 🖥️ PRISMA STUDIO (Interface Visual)

### **Abrir:**
```bash
bunx prisma studio
```

### **Acessar em:**
```
http://localhost:5555
```

### **Funcionalidades:**
- Visualizar dados em formato de tabela
- Criar, editar, deletar registros
- Filtrar e buscar dados
- Ver relações entre modelos

---

## 📊 MODELOS DEFINIDOS

### **User:**
```typescript
{
  id: string        // ID único automático
  email: string     // Email único
  name?: string     // Nome opcional
  createdAt: DateTime // Data de criação
  updatedAt: DateTime // Data de atualização
}
```

### **Post:**
```typescript
{
  id: string        // ID único automático
  title: string     // Título do post
  content?: string // Conteúdo opcional
  published: boolean // Se está publicado
  authorId: string  // ID do autor (User)
  createdAt: DateTime // Data de criação
  updatedAt: DateTime // Data de atualização
}
```

---

## 🔐 SEGURANÇA

### **Arquivos protegidos (.gitignore):**
```
db/          ← Banco de dados local
*.db         ← Arquivos de banco
.env         ← Credenciais
```

**Importante:** O banco de dados local NÃO é versionado.

---

## 📞 PARA COMEÇAR A USAR:

### **1. Adicionar novos models (se necessário):**
```bash
# 1. Editar prisma/schema.prisma
# 2. Adicionar novo model
# 3. Rodar:
bun run db:push
```

### **2. Usar no código:**
```typescript
import { db } from '@/lib/db'

// Exemplo: Criar usuário
const user = await db.user.create({
  data: { email: 'exemplo@teste.com' }
})
```

### **3. Visualizar dados:**
```bash
bunx prisma studio
```

### **4. Criar APIs:**
```bash
# Criar arquivo: src/app/api/users/route.ts
# Usar import { db } from '@/lib/db'
```

---

## ✅ STATUS ATUAL

```
Banco de Dados:      ✅ SQLite configurado
Schema:               ✅ Prisma definido
Client:               ✅ Exportado em src/lib/db.ts
Env Variables:         ✅ .env configurado
Proteção:             ✅ .gitignore ativo
Conexão:              ✅ Testada e funcionando
Comandos:             ✅ Disponíveis no package.json
```

---

## 📚 REFERÊNCIAS

- **Documentação Prisma**: https://www.prisma.io/docs
- **Guia completo**: Veja `GUIA_BANCO_DADOS.md`
- **Resumo rápido**: Veja `RESUMO_BANCO_DADOS.md`

---

**Carlos, o banco de dados já está configurado e pronto para uso!**

Você pode:
1. Importar: `import { db } from '@/lib/db'`
2. Usar: `await db.user.create(...)`
3. Visualizar: `bunx prisma studio`
4. Criar APIs: Usar o db em Server Actions

**Tudo pronto para começar!** 🚀
