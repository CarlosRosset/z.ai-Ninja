# 🚀 Guia Rápido: Clonar e Configurar Fluxo Bidirecional

---

## ✅ PASSO 1: Confirme Repositório no GitHub

Acesse: https://github.com/CarlosRosset/z.ai-Ninja

Confirme que você vê:
- ✅ 464 arquivos
- ✅ Commit: `09a18d8` - "Initial commit"

---

## 📥 PASSO 2: Clone o Repositório no Seu PC

### No Windows (PowerShell/CMD):
```bash
cd C:\Users\SEU-USUARIO\Documents\Projetos
git clone https://github.com/CarlosRosset/z.ai-Ninja.git
cd z.ai-Ninja
```

### No macOS/Linux (Terminal):
```bash
cd ~/Documents/Projetos
git clone https://github.com/CarlosRosset/z.ai-Ninja.git
cd z.ai-Ninja
```

### Verifique:
```bash
git status
git log --oneline
```

---

## 🔧 PASSO 3: Configure Git (Primeira Vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

**Exemplo:**
```bash
git config --global user.name "Carlos Rosset"
git config --global user.email "seu-email@gmail.com"
```

---

## ✏️ PASSO 4: Faça Sua Primeira Edição

### 4.1 Edite um arquivo
- Abra o projeto no seu editor (VS Code, etc.)
- Edite `src/app/page.tsx`

### 4.2 Verifique as mudanças
```bash
git status
git diff
```

---

## 💾 PASSO 5: Commit e Push

```bash
# Adicione as mudanças
git add .

# Faça o commit
git commit -m "Minha primeira alteração"

# Envie para o GitHub
git push
```

**Se pedir autenticação:**
- Username: `CarlosRosset`
- Password: **SEU TOKEN** (não senha!)

---

## 🔄 PASSO 6: Me Avise das Alterações

**Envie para mim uma mensagem como:**
```
"Fiz alterações no projeto. Pode dar pull para atualizar."
```

---

## 🤖 PASSO 7: Eu Recupero e Trabalho

**No ambiente de desenvolvimento:**
```bash
cd /home/z/my-project
git pull origin main
git log --oneline
```

**Eu verifico, testo e faço ajustes se necessário.**

---

## 🔄 PASSO 8: Você Atualiza seu PC

```bash
# No seu PC
git pull origin main
```

---

## 📋 CICLO COMPLETO (RESUMO)

```
┌─────────────────┐
│  VOCÊ NO PC    │
└────────┬────────┘
         │
         │ 1. Edita arquivos
         │ 2. git add .
         │ 3. git commit -m "..."
         │ 4. git push
         │
         ▼
┌─────────────────┐
│     GITHUB      │
└────────┬────────┘
         │
         │ 5. Você me avisa
         │
         ▼
┌─────────────────┐
│   AMBIENTE DE   │
│  DESENVOLVIMENTO│
└────────┬────────┘
         │
         │ 6. Eu: git pull
         │ 7. Eu verifico/testo
         │ 8. Eu: git add/commit/push
         │
         ▼
┌─────────────────┐
│     GITHUB      │
└────────┬────────┘
         │
         │ 9. Você: git pull
         │
         ▼
┌─────────────────┐
│  VOCÊ NO PC    │ ← CICLO REINICIA
└─────────────────┘
```

---

## ⚡ COMANDOS RÁPIDOS

```bash
# Clonar (primeira vez)
git clone https://github.com/CarlosRosset/z.ai-Ninja.git

# Ver status
git status

# Ver mudanças
git diff

# Adicionar tudo
git add .

# Commit
git commit -m "Descrição"

# Push
git push

# Pull
git pull

# Ver histórico
git log --oneline
```

---

## 🎯 TESTE RÁPIDO

### No seu PC:

```bash
# 1. Clone o projeto
git clone https://github.com/CarlosRosset/z.ai-Ninja.git
cd z.ai-Ninja

# 2. Crie um arquivo de teste
echo "# Teste" > TESTE.md

# 3. Adicione, commit e push
git add TESTE.md
git commit -m "Arquivo de teste"
git push
```

### Me avise que criou o arquivo TESTE.md!

### Eu verificarei no ambiente:

```bash
cd /home/z/my-project
git pull origin main
ls TESTE.md
```

### Depois você pode deletar:

```bash
git rm TESTE.md
git commit -m "Remove arquivo de teste"
git push
```

---

## ⚠️ ATENÇÃO

- **Sempre faça `git pull`** antes de começar a trabalhar
- **Use mensagens de commit claras**
- **Push frequentemente** para não perder trabalho
- **Use seu TOKEN** (não senha do GitHub)

---

## 📞 SE PRECISAR DE AJUDA

**Erro ao fazer push?**
- Verifique se está usando o TOKEN
- Verifique se o remote está correto: `git remote -v`

**Erro ao fazer pull?**
- Verifique se há conflitos
- Veja o que mudou: `git status`

---

**Repositório**: https://github.com/CarlosRosset/z.ai-Ninja
**Commit atual**: 09a18d8

**Pronto para começar!** 🚀
