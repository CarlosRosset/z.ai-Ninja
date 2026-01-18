# ✅ Checklist Interativo: Configurar Fluxo de Trabalho Bidirecional

---

## 📋 CHECKLIST PARA CONFIGURAÇÃO

### **SEÇÃO 1: Instalar e Clonar**

- [ ] **Verifique se Git está instalado**
  ```bash
  git --version
  ```
  ___ Se mostrar versão, já instalado!
  ___ Se não, instale em: https://git-scm.com/download/win

- [ ] **Clone o repositório no seu PC**
  ```bash
  git clone https://github.com/CarlosRosset/z.ai-Ninja.git
  cd z.ai-Ninja
  ```

- [ ] **Verifique se funcionou**
  ```bash
  git status
  git log --oneline
  ```
  ___ Deve mostrar commit `09a18d8` "Initial commit"

### **SEÇÃO 2: Configurar Git**

- [ ] **Configure seu nome**
  ```bash
  git config --global user.name "Seu Nome"
  ```

- [ ] **Configure seu email**
  ```bash
  git config --global user.email "seu-email@exemplo.com"
  ```

- [ ] **Verifique a configuração**
  ```bash
  git config --global --list
  ```

### **SEÇÃO 3: Primeiro Teste**

- [ ] **Edite um arquivo de teste**
  ```bash
  echo "# Teste do fluxo de trabalho" > TESTE_WORKFLOW.md
  ```

- [ ] **Verifique a mudança**
  ```bash
  git status
  ```

- [ ] **Adicione e commit**
  ```bash
  git add TESTE_WORKFLOW.md
  git commit -m "Teste: arquivo de fluxo de trabalho"
  ```

- [ ] **Faça push**
  ```bash
  git push
  ```
  ___ Se pedir autenticação, use seu TOKEN

- [ ] **Verifique no GitHub**
  ```
  Acesse: https://github.com/CarlosRosset/z.ai-Ninja
  ```
  ___ Confirme que o arquivo TESTE_WORKFLOW.md aparece

- [ ] **ME AVISE** que criou o arquivo de teste!

### **SEÇÃO 4: Eu Verifico e Trabalho**

- [ ] **Eu baixo suas mudanças**
  ```bash
  # Eu executo isso no ambiente
  git pull origin main
  ```

- [ ] **Eu verifico**
  ```bash
  # Eu executo isso no ambiente
  ls TESTE_WORKFLOW.md
  git log --oneline
  ```

- [ ] **Eu confirmo** que recebi suas alterações

- [ ] **Eu faço um ajuste (opcional)**
  ```bash
  # Eu executo isso no ambiente
  echo "Verificado e recebido com sucesso!" >> TESTE_WORKFLOW.md
  git add TESTE_WORKFLOW.md
  git commit -m "Confirma recebimento do teste"
  git push
  ```

- [ ] **EU TE AVISO** que fiz o ajuste

### **SEÇÃO 5: Você Atualiza seu PC**

- [ ] **Baixe minhas mudanças**
  ```bash
  git pull origin main
  ```

- [ ] **Verifique o que mudei**
  ```bash
  cat TESTE_WORKFLOW.md
  git log --oneline -2
  ```

- [ ] **Limpe o teste**
  ```bash
  git rm TESTE_WORKFLOW.md
  git commit -m "Remove arquivo de teste"
  git push
  ```

---

## ✅ FLUXO DE TRABALHO DIÁRIO

### **Antes de começar a trabalhar (SEMPRE):**

- [ ] **Atualize seu PC**
  ```bash
  git pull origin main
  ```

- [ ] **Verifique se há mudanças**
  ```bash
  git log --oneline -5
  ```

### **Enquanto trabalha:**

- [ ] **Verifique o status periodicamente**
  ```bash
  git status
  ```

- [ ] **Faça commits frequentes**
  ```bash
  git add .
  git commit -m "Descreva suas mudanças"
  ```

### **Ao pausar o trabalho:**

- [ ] **Fazer push**
  ```bash
  git push
  ```

- [ ] **ME AVISE** se fez mudanças importantes

---

## 🎯 CENÁRIO: Adicionar uma Funcionalidade

### **VOCÊ:**

- [ ] **Crie um branch**
  ```bash
  git checkout -b feature/nova-funcionalidade
  ```

- [ ] **Desenvolva a funcionalidade**

- [ ] **Faça commits**
  ```bash
  git add .
  git commit -m "Implementa nova funcionalidade"
  ```

- [ ] **Push do branch**
  ```bash
  git push -u origin feature/nova-funcionalidade
  ```

- [ ] **ME AVISE** do novo branch

### **EU:**

- [ ] **Baixo o branch**
  ```bash
  git pull origin feature/nova-funcionalidade
  ```

- [ ] **Testo a funcionalidade**

- [ ] **Faço ajustes se necessário**

- [ ] **Feco e push de volta**
  ```bash
  git checkout main
  git merge feature/nova-funcionalidade
  git push origin main
  ```

- [ ] **TE AVISO** que testei e integrei

### **VOCÊ:**

- [ ] **Atualiza seu PC**
  ```bash
  git checkout main
  git pull origin main
  ```

- [ ] **Deleta o branch local (opcional)**
  ```bash
  git branch -d feature/nova-funcionalidade
  ```

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### **Erro: "fatal: not a git repository"**

[ ] **Verifique se está no diretório certo**
  ```bash
  pwd
  cd z.ai-Ninja  # ou o diretório do seu projeto
  ```

### **Erro: Authentication failed**

[ ] **Verifique se está usando o TOKEN** (não senha)

[ ] **Crie um novo token** se necessário
  ```
  Acesse: https://github.com/settings/tokens
  ```

### **Erro: Pull/Push rejected**

[ ] **Verifique o branch**
  ```bash
  git branch
  ```

[ ] **Verifique o remote**
  ```bash
  git remote -v
  ```

[ ] **Force pull (cuidado!)**
  ```bash
  git pull --rebase origin main
  ```

### **Erro: Merge conflict**

[ ] **Abra o arquivo em conflito**

[ ] **Resolva as diferenças** (remova <<<<<<<, =======, >>>>>>>)

[ ] **Adicione e commit**
  ```bash
  git add .
  git commit -m "Resolve conflito"
  ```

[ ] **Push**
  ```bash
  git push
  ```

---

## 📝 ANOTAÇÕES

### **URL do repositório:**
```
https://github.com/CarlosRosset/z.ai-Ninja
```

### **Commit atual:**
```
09a18d8
```

### **Branch principal:**
```
main
```

### **Seu usuário GitHub:**
```
CarlosRosset
```

### **Data de início do fluxo:**
```
________________________
```

### **Comentários:**
```
________________________________________________________________________
________________________________________________________________________
________________________________________________________________________
```

---

## ✨ CHECKLIST FINAL

- [ ] Git instalado no PC
- [ ] Repositório clonado
- [ ] Git configurado (nome e email)
- [ ] Primeiro teste realizado
- [ ] Push funcionando
- [ ] Entendo o fluxo de trabalho
- [ ] Sei como me avisar das mudanças
- [ ] Sei como atualizar meu PC

---

## 🎉 PRONTO PARA COMEÇAR!

Quando completar este checklist, o fluxo bidirecional estará configurado!

**Repositório**: https://github.com/CarlosRosset/z.ai-Ninja
**Guia completo**: GUIDE_BIDIRECTIONAL_WORKFLOW.md
**Guia rápido**: QUICK_START_WORKFLOW.md

---

**Boa codificação!** 🚀
