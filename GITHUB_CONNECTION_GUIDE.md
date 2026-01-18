# 🚀 Guia Passo a Passo: Conectar Projeto Local ao GitHub

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisará:

- [ ] **Conta no GitHub** (crie em https://github.com se não tiver)
- [ ] **Nome desejado para o repositório** (ex: `meu-projeto-nextjs`)
- [ ] **Token de autenticação** (explico abaixo como criar)

---

## ETAPA 1: Criar Repositório no GitHub

### 1.1 Faça login no GitHub
- Acesse: https://github.com
- Entre com sua conta

### 1.2 Crie um novo repositório
1. Clique no **+** no canto superior direito
2. Selecione **"New repository"**
3. Preencha as informações:
   - **Repository name**: Digite o nome (ex: `meu-projeto-nextjs`)
   - **Description**: (opcional) Uma descrição do projeto
   - **Visibility**:
     - 🌐 **Public**: Qualquer um pode ver
     - 🔒 **Private**: Apenas você pode ver (recomendado)
   - ⚠️ **IMPORTANTE**: **NÃO marque** nenhuma opção de:
     - [ ] Add a README file
     - [ ] Add .gitignore
     - [ ] Choose a license
   - **O repositório deve ficar VAZIO!**

4. Clique em **"Create repository"**

### 1.3 Anote as informações do repositório
Após criar, o GitHub mostrará informações como:
```
https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
```

**Copie este URL** para a próxima etapa!

---

## ETAPA 2: Criar Token de Autenticação (Personal Access Token)

O GitHub não aceita mais senha para push. Você precisa criar um token.

### 2.1 Acesse as configurações
1. No GitHub, clique no seu avatar → **Settings**
2. No menu lateral, role até o final
3. Clique em **"Developer settings"**
4. Clique em **"Personal access tokens"**
5. Clique em **"Tokens (classic)"** (ou "Fine-grained tokens" se disponível)

### 2.2 Crie um novo token
1. Clique em **"Generate new token"** → **"Generate new token (classic)"**

### 2.3 Configure o token
Preencha assim:
- **Note**: Descrição (ex: "Token para projeto local")
- **Expiration**: Escolha a validade (recomendo 90 days ou No expiration)
- **Select scopes**: Marque:
  - ✅ `repo` (controla repositórios privados)
  - ✅ `workflow` (se usar GitHub Actions futuramente)
  - ✅ `gist` (opcional)

2. Clique em **"Generate token"**

### 2.3 Copie o token ⚠️ **MUITO IMPORTANTE!**
- **O token aparecerá uma única vez!**
- **COPIE AGORA!** Salve em local seguro
- Você não conseguirá ver o token novamente depois

**Exemplo de formato** (não use este):
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ETAPA 3: Configurar Git no Projeto Local

### 3.1 Verifique suas configurações atuais
No terminal do projeto:
```bash
cd /home/z/my-project
git config user.name
git config user.email
```

**Configuração atual do seu projeto:**
```
Nome: Z User
Email: z@container
```

### 3.2 Atualize suas configurações (opcional)
Se quiser usar suas informações reais do GitHub:

```bash
git config user.name "Seu Nome"
git config user.email "seu-email@exemplo.com"
```

---

## ETAPA 4: Conectar ao Repositório Remoto

### 4.1 Adicione o remote
Substitua pela URL do seu repositório criado na **ETAPA 1**:

```bash
cd /home/z/my-project
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
```

**Exemplo real:**
```bash
git remote add origin https://github.com/joao-silva/meu-projeto-nextjs.git
```

### 4.2 Verifique se o remote foi adicionado
```bash
git remote -v
```

Deve mostrar algo como:
```
origin    https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git (fetch)
origin    https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git (push)
```

---

## ETAPA 5: Fazer Push para o GitHub

### 5.1 Faça o push do commit inicial
```bash
cd /home/z/my-project
git push -u origin master
```

### 5.2 Autenticação
O Git pedirá suas credenciais:

1. **Username**: Digite seu usuário do GitHub
2. **Password**: **COLE SEU TOKEN AQUI** (não é a senha do GitHub!)

⚠️ **IMPORTANTE**: Use o token criado na **ETAPA 2**, não sua senha!

### 5.3 Se aparecer aviso de autenticação 2FA
Algumas versões do Git podem mostrar:
```
Support for password authentication was removed...
```
Isso é normal - é por isso que estamos usando o token!

---

## ETAPA 6: Verificar a Conexão

### 6.1 Verifique no GitHub
- Acesse: https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO
- Você deve ver:
  - ✅ Todos os arquivos do projeto
  - ✅ O commit inicial (09a18d8)
  - ✅ 464 arquivos trackeados

### 6.2 Verifique no terminal
```bash
cd /home/z/my-project
git status
git log --oneline
```

Deve mostrar:
```
On branch master
Your branch is up to date with 'origin/master'.
```

---

## 📝 Comandos Essenciais de Git + GitHub

### Fazer push de novos commits
```bash
git add .
git commit -m "Sua mensagem de commit"
git push
```

### Ver status
```bash
git status
git log --oneline
```

### Ver branches remotas
```bash
git branch -r
```

### Fazer pull (atualizar do GitHub)
```bash
git pull
```

---

## 🔧 Solução de Problemas

### Problema 1: Authentication failed
**Causa**: Token incorreto ou expirado
**Solução**:
1. Crie um novo token (ETAPA 2)
2. Use o novo token

### Problema 2: Repository not found
**Causa**: URL do repositório errada
**Solução**:
```bash
git remote set-url origin https://github.com/SEU-USUARIO/NOME-CORRETO.git
```

### Problema 3: fatal: remote origin already exists
**Causa**: Já existe um remote configurado
**Solução**:
```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
```

### Problema 4: fatal: refusing to merge unrelated histories
**Causa**: Repositório GitHub com arquivos criados (README, etc)
**Solução**: Apague o repositório no GitHub e crie um novo VAZIO

---

## 📚 Conceitos Importantes

### O que é "origin"?
`origin` é o nome padrão do repositório remoto
- `origin/master` = branch master no GitHub
- `master` = branch master local

### O que é o comando `git push -u`?
- `-u` significa `--set-upstream`
- Configura a relação entre branch local e remoto
- Depois disso, só precisa usar `git push`

### Hash do commit inicial:
```
09a18d821bcdab4b0adc594b39e86dd1617e1f65
```

---

## ✅ Checklist Final

Antes de começar, confirme:

- [ ] Tenho conta no GitHub
- [ ] Criei repositório VAZIO no GitHub
- [ ] Copiei a URL do repositório
- [ ] Criei token de autenticação
- [ ] Salvei o token em local seguro
- [ ] Adicionei o remote no projeto local
- [ ] Fiz o push para o GitHub

---

## 🎯 Comandos Rápidos (Resumo)

```bash
# 1. Adicionar remote (substitua pela URL do seu repositório)
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git

# 2. Verificar remote
git remote -v

# 3. Fazer push inicial
git push -u origin master

# 4. Verificar status
git status

# 5. Ver commits
git log --oneline
```

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas em alguma etapa:
1. Copie a mensagem de erro
2. Me informe em qual etapa está
3. Vou ajudar a resolver!

---

**Gerado em**: 18 de Janeiro de 2026
**Repositório Local**: /home/z/my-project
**Commit Inicial**: 09a18d821bcdab4b0adc594b39e86dd1617e1f65
