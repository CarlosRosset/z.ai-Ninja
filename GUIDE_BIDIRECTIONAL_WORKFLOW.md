# 🔁 Guia de Fluxo de Trabalho Bidirecional
# PC Local ↔ GitHub ↔ Ambiente de Desenvolvimento

---

## 📋 VISÃO GERAL DO FLUXO

```
┌─────────────┐         ┌─────────────┐         ┌──────────────────────┐
│   SEU PC    │         │   GITHUB    │         │  AMBIENTE DE        │
│   (LOCAL)   │         │  (REMOTO)   │         │  DESENVOLVIMENTO    │
│             │         │             │         │  (/home/z/my-project)│
└──────┬──────┘         └──────┬──────┘         └──────────┬───────────┘
       │                      │                           │
       │ git push             │                           │
       │─────────────────────>│                           │
       │                      │                           │
       │                      │ git clone / pull          │
       │                      │<──────────────────────────│
       │                      │                           │
       │ git pull             │                           │ git pull
       │<─────────────────────│                           │
       │                      │                           │
       │                      │                           │
       │          git push   │                           │
       │                      │<──────────────────────────│
       │                      │                           │
       │ git pull             │                           │
       │<─────────────────────│                           │
```

---

## 🎯 CONCEITO

**Via Dupla**: Você edita no seu PC, envia para o GitHub, e eu recupero as alterações no ambiente de desenvolvimento para continuar o trabalho.

---

## ✅ ETAPA 1: Confirmar Repositório no GitHub

### 1.1 Acesse o repositório
```
https://github.com/CarlosRosset/z.ai-Ninja
```

### 1.2 Verifique se você vê:
- ✅ 464 arquivos
- ✅ Commit: `09a18d8` - "Initial commit"
- ✅ Estrutura do projeto Next.js
- ✅ Branch: `main`

**Se você confirmar, podemos prosseguir!**

---

## 🖥️ ETAPA 2: Instalar Git no Seu PC

### 2.1 Verificar se já tem Git instalado

**No Windows:**
```bash
# Abra o Prompt de Comando ou PowerShell
git --version
```

**No macOS:**
```bash
# Abra o Terminal
git --version
```

**No Linux:**
```bash
# Abra o Terminal
git --version
```

### 2.2 Se não tiver Git instalado

**Windows:**
- Acesse: https://git-scm.com/download/win
- Baixe e instale o Git
- Use configurações padrão durante a instalação

**macOS:**
```bash
# Instale via Homebrew (se tiver)
brew install git

# Ou use Xcode Command Line Tools
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

---

## 📥 ETAPA 3: Clonar o Repositório no Seu PC

### 3.1 Escolha um diretório para o projeto

**Windows:**
```bash
# Navegue até seu diretório de projetos
cd C:\Users\SEU-USUARIO\Documents\Projetos
```

**macOS/Linux:**
```bash
# Navegue até seu diretório de projetos
cd ~/Documents/Projetos
# ou
cd ~/projects
```

### 3.2 Clone o repositório

```bash
git clone https://github.com/CarlosRosset/z.ai-Ninja.git
```

### 3.3 Entre no diretório do projeto

**Windows:**
```bash
cd z.ai-Ninja
```

**macOS/Linux:**
```bash
cd z.ai-Ninja
```

### 3.4 Verifique o clone

```bash
# Verifique o status
git status

# Veja o branch atual
git branch

# Veja os commits
git log --oneline
```

Você deve ver:
```
On branch main
Your branch is up to date with 'origin/main'.

09a18d8 Initial commit
```

---

## 🔧 ETAPA 4: Configurar Git no Seu PC (Primeira vez)

### 4.1 Configure seu nome

```bash
git config --global user.name "Seu Nome"
```

**Exemplo:**
```bash
git config --global user.name "Carlos Rosset"
```

### 4.2 Configure seu email

```bash
git config --global user.email "seu-email@exemplo.com"
```

**Use o mesmo email do GitHub!**

### 4.3 Verifique a configuração

```bash
git config --global --list
```

Você deve ver:
```
user.name=Seu Nome
user.email=seu-email@exemplo.com
```

---

## 🌿 ETAPA 5: Criar e Usar Branches (Opcional mas Recomendado)

### 5.1 Crie um branch para suas edições

```bash
# Crie um novo branch
git checkout -b feature/minha-edicao
```

**Ou para uma tarefa específica:**
```bash
git checkout -b fix/corrigir-bug
git checkout -b docs/adicionar-readme
git checkout -b style/atualizar-cores
```

### 5.2 Verifique o branch atual

```bash
git branch
```

Você deve ver:
```
  main
* feature/minha-edicao
```

### 5.3 Volte para o branch principal (se necessário)

```bash
git checkout main
```

---

## ✏️ ETAPA 6: Fazer Edições no Seu PC

### 6.1 Edite um arquivo

Use seu editor de código favorito:
- VS Code (recomendado)
- Visual Studio
- Sublime Text
- WebStorm
- Vim/Emacs

**Exemplo:** Edite `src/app/page.tsx`

### 6.2 Salve as alterações

### 6.3 Verifique o que foi alterado

```bash
git status
```

Você deve ver:
```
On branch main (ou seu branch de trabalho)
Changes not staged for commit:
  modified:   src/app/page.tsx
```

### 6.4 Veja as diferenças

```bash
git diff
```

---

## 💾 ETAPA 7: Commit das Alterações

### 7.1 Adicione os arquivos modificados

```bash
# Adicionar arquivo específico
git add src/app/page.tsx

# Ou adicionar todas as mudanças
git add .
```

### 7.2 Faça o commit

```bash
git commit -m "Descrição clara das alterações"
```

**Exemplos de boas mensagens de commit:**
```bash
git commit -m "Adiciona componente de navegação"
git commit -m "Corrige bug no formulário de contato"
git commit -m "Atualiza documentação do README"
git commit -m "Melhora estilo da página inicial"
```

### 7.3 Veja o commit

```bash
git log --oneline -1
```

---

## 🚀 ETAPA 8: Enviar para o GitHub (Push)

### 8.1 Primeiro push do branch (se estiver usando branch)

```bash
git push -u origin feature/minha-edicao
```

### 8.2 Push para o branch principal (main)

```bash
git push
```

**Se for a primeira vez, pode pedir autenticação:**
- **Username**: Seu usuário do GitHub (CarlosRosset)
- **Password**: Cole seu **TOKEN** de acesso (não a senha)

### 8.3 Verifique no GitHub

- Acesse: https://github.com/CarlosRosset/z.ai-Ninja
- Você deve ver suas alterações
- Verifique o histórico de commits

---

## 🔄 ETAPA 9: Recuperar Alterações no Ambiente de Desenvolvimento

### 9.1 Você me avisa que fez alterações

**Exemplo de mensagem para mim:**
```
"Fiz alterações no projeto. Você pode dar um pull para atualizar?"
```

### 9.2 Eu executo no ambiente

```bash
cd /home/z/my-project
git pull origin main
```

### 9.3 Eu verifico as alterações

```bash
git log --oneline
git status
```

### 9.4 Eu testo as mudanças

- Verifico o código
- Testo funcionalidades
- Faço ajustes se necessário

### 9.5 Se eu fizer alterações

```bash
git add .
git commit -m "Ajustes feitos"
git push
```

---

## 🔄 ETAPA 10: Atualizar o Seu PC com Minhas Alterações

### 10.1 Baixe as mudanças do GitHub

```bash
cd /home/seu-diretorio/z.ai-Ninja
git pull origin main
```

### 10.2 Verifique o que mudou

```bash
git log --oneline -5
git diff HEAD~1
```

### 10.3 Continue o ciclo!

---

## 📋 FLUXO DE TRABALHO COMPLETO (RESUMO)

### **CICLO 1: Você edita no PC**

```bash
# 1. Verifique o branch
git status

# 2. Faça suas edições (com seu editor)

# 3. Veja as mudanças
git status
git diff

# 4. Adicione os arquivos
git add .

# 5. Faça o commit
git commit -m "Descrição das alterações"

# 6. Envie para o GitHub
git push

# 7. ME AVISE que fez alterações
```

### **CICLO 2: Eu recupero e trabalho**

```bash
# 1. Eu baixo as mudanças
git pull origin main

# 2. Eu verifico e testo
git log --oneline

# 3. Eu faço alterações se necessário

# 4. Eu commito e envio de volta
git add .
git commit -m "Ajustes feitos"
git push
```

### **CICLO 3: Você atualiza seu PC**

```bash
# 1. Você baixa minhas mudanças
git pull origin main

# 2. Verifica o que mudou
git log --oneline -5

# 3. Continue trabalhando...
```

---

## 🚨 RESOLVENDO CONFLITOS

### Se houver conflitos ao dar pull:

```bash
# 1. Tente fazer o pull
git pull origin main

# 2. Se houver conflitos, o Git avisará:
# CONFLICT (content): Merge conflict in src/app/page.tsx

# 3. Abra o arquivo em conflito e resolva
# O Git mostrará:
# <<<<<<< HEAD
# Suas mudanças locais
# =======
# Mudanças do remoto
# >>>>>>> origin/main

# 4. Resolva mantendo o que quer
# Remova os marcadores <<<<<<<, =======, >>>>>>>

# 5. Adicione e commit
git add .
git commit -m "Resolve conflitos de merge"

# 6. Push
git push
```

---

## 📝 COMANDOS ESSENCIAIS

### **No SEU PC**

```bash
# Clonar (primeira vez)
git clone https://github.com/CarlosRosset/z.ai-Ninja.git

# Entrar no diretório
cd z.ai-Ninja

# Ver status
git status

# Ver mudanças
git diff

# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição"

# Enviar para GitHub
git push

# Baixar mudanças
git pull

# Ver histórico
git log --oneline

# Ver branches
git branch

# Criar e trocar branch
git checkout -b nome-do-branch

# Voltar para main
git checkout main
```

---

## ✅ CHECKLIST DO FLUXO

### **Para você configurar no PC:**
- [ ] Git instalado no PC
- [ ] Repositório clonado no PC
- [ ] Git configurado (nome e email)
- [ ] Testei edição e commit
- [ ] Testei push para o GitHub

### **Para o fluxo de trabalho:**
- [ ] Eu fiz alterações no PC
- [ ] Eu dei push para o GitHub
- [ ] Eu avisei você das alterações
- [ ] Você deu pull no ambiente
- [ ] Você verificou/testou
- [ ] Você fez ajustes se necessário
- [ ] Você deu push de volta
- [ ] Eu dei pull no PC

---

## 🎯 EXEMPLO PRÁTICO COMPLETO

### **CENÁRIO**: Você vai adicionar uma nova página

#### **No SEU PC:**

```bash
# 1. Clone (se ainda não fez)
git clone https://github.com/CarlosRosset/z.ai-Ninja.git
cd z.ai-Ninja

# 2. Crie um branch para a nova página
git checkout -b feature/nova-pagina-sobre

# 3. Crie o arquivo da nova página
# (Use seu editor para criar src/app/sobre/page.tsx)

# 4. Veja o que mudou
git status
# Output: new file:   src/app/sobre/page.tsx

# 5. Adicione e commit
git add src/app/sobre/page.tsx
git commit -m "Adiciona página sobre"

# 6. Push para o GitHub
git push -u origin feature/nova-pagina-sobre

# 7. ME AVISE:
"Adicionei uma nova página 'sobre'. Branch: feature/nova-pagina-sobre"
```

#### **No AMBIENTE DE DESENVOLVIMENTO:**

```bash
# 1. Baixo suas mudanças
cd /home/z/my-project
git pull origin main

# 2. Verifico o que você fez
git log --oneline
ls src/app/
# Vejo a nova pasta 'sobre'

# 3. Testo a página
# (Navego em http://localhost:3000/sobre)

# 4. Faço ajustes se necessário
git add .
git commit -m "Ajusta estilo da página sobre"
git push

# 5. TE AVISO:
"Testei e fiz alguns ajustes. Pode dar pull no seu PC."
```

#### **De volta no SEU PC:**

```bash
# 1. Baixo meus ajustes
git pull origin main

# 2. Verifico o que mudei
git log --oneline -2

# 3. Continuo trabalhando...
```

---

## 💡 DICAS IMPORTANTES

### **Mensagens de Commit Boas:**
```
✅ "Adiciona componente de botão"
✅ "Corrige bug no formulário"
✅ "Atualiza documentação"
✅ "Refatora código de autenticação"

❌ "mudei coisas"
❌ "atualiza"
❌ "fix"
❌ "arquivo novo"
```

### **Quando fazer commit:**
- ✅ Após concluir uma funcionalidade
- ✅ Após corrigir um bug
- ✅ Após fazer mudanças significativas
- ❌ Não faça commit no meio do código quebrado

### **Quando fazer push:**
- ✅ Após fazer commit
- ✅ Antes de fazer uma pausa no trabalho
- ✅ Quando quer compartilhar mudanças

### **Quando fazer pull:**
- ✅ Antes de começar a trabalhar (sempre!)
- ✅ Quando eu te aviso que fiz mudanças
- ✅ Quando você voltar de uma pausa

---

## 🔗 LINKS ÚTEIS

- **Repositório GitHub**: https://github.com/CarlosRosset/z.ai-Ninja
- **Documentação Git**: https://git-scm.com/doc
- **Guia GitHub**: https://docs.github.com/pt

---

## 📞 SE PRECISAR DE AJUDA

Se tiver problemas:
1. Copie a mensagem de erro
2. Me avise em qual etapa está
3. Descreva o que tentou fazer

---

**Repositório**: https://github.com/CarlosRosset/z.ai-Ninja
**Commit atual**: 09a18d8
**Branch**: main

**Pronto para começar!** 🚀
