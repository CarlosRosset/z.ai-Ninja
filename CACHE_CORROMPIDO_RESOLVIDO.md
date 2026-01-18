# 🔧 Resolvendo Erros 404 - Cache Corrompido

## 🚨 Problema

```
/_next/static/chunks/main-app.js?v=1768774051893:1 404 (Not Found)
/_next/static/chunks/app-pages-internals.js:1 404 (Not Found)
/_next/static/chunks/app/layout.js:1 404 (Not Found)
/_next/static/css/app/layout.css?v=1768774051893:1 404 (Not Found)
```

## 📋 Causa

O cache do Next.js (`.next`) estava corrompido/desincronizado, causando:
- Navegador tentando carregar recursos inexistentes
- Version mismatch entre build e runtime
- Arquivos estáticos não encontrados

---

## ✅ Solução Aplicada

### 1. Limpar Cache do Next.js
```bash
pkill -f "next-server"
rm -rf /home/z/my-project/.next
```

### 2. Reiniciar Servidor
```bash
bun run dev > /home/z/my-project/dev.log 2>&1 &
```

### 3. Servidor Reiniciado com Sucesso
```
✓ Ready in 1224ms
Status: Rodando (http://localhost:3000)
```

---

## 🧪 Como Testar

### Localmente (http://localhost:81):
```bash
# Testa endpoint de debug
curl -s http://localhost:81/api/debug

# Resultado: ✅ OK
# userCount: 3
```

### No Navegador (Preview URL):

#### Passo 1: LIMPAR CACHE DO NAVEGADOR

**Chrome/Edge:**
- `Ctrl + Shift + R` (Recarregar ignorando cache)
- Ou `F12` → Network → Desmarcar "Disable cache"
- Recarregar página

**Firefox:**
- `Ctrl + Shift + R` (Recarregar ignorando cache)
- Ou `Ctrl + F5` (Recarregar forçado)

**Safari (iOS/Mac):**
- `Cmd + Shift + R` (Recarregar ignorando cache)
- Ou `Cmd + Option + R`

#### Passo 2: Limpar Cookies

1. Pressione `F12` para abrir DevTools
2. Vá para **Application** → **Cookies**
3. Selecione `preview-chat-*.space.z.ai`
4. Clique com botão direito → **Clear**
5. Recarregue a página

#### Passo 3: Testar

```javascript
// No console do navegador (F12):
fetch('https://preview-chat-d4e8795e-c675-4222-824a-845253893d8f.space.z.ai/api/debug')
  .then(r => r.json())
  .then(d => console.log('Debug:', d))
```

**Esperado**: `userCount: 3` (ou mais)

---

## 📊 Status Atual

| Componente | Status |
|-----------|--------|
| Servidor Next.js | ✅ Rodando |
| Cache .next | ✅ Limpo |
| Banco de dados | ✅ Conectado (3 usuários) |
| APIs locais | ✅ Funcionando |
| Preview URL | ⏳ Aguardando limpeza de cache do navegador |

---

## 🔄 Como Evitar no Futuro

### Limpeza Automática

Criar script `clean.sh`:
```bash
#!/bin/bash
pkill -f "next-server"
rm -rf .next
bun run dev > dev.log 2>&1 &
```

### Detectar Erros de Cache

Sempre que ver estes erros:
- `Cannot find module './xxx.js'`
- Recursos estáticos 404
- Erros estranhos de webpack

Execute:
```bash
pkill -f "next-server"
rm -rf .next
bun run dev
```

---

## 📝 Resumo

| Problema | Causa | Solução | Status |
|---------|--------|---------|--------|
| 404 em chunks | Cache corrompido | Limpar .next | ✅ Aplicado |
| Recursos não encontrados | Build desincronizado | Rebuild automático | ✅ Funcionando |
| Navegador cacheado | Version mismatch | Limpar cache navegador | ⏳ Usuário precisa fazer |

---

## 🎯 Próximos Passos

1. ⏳ Usuário limpa cache do navegador (Ctrl+Shift+R)
2. ⏳ Testa preview URL novamente
3. ⏳ Verifica se carrega sem erros 404
4. ⏳ Testa login no preview URL
5. ⏳ Testa login no domínio público após deploy

---

## ✅ Comandos Úteis

### Verificar Logs
```bash
tail -f /home/z/my-project/dev.log
```

### Limpar e Reiniciar
```bash
pkill -f "next-server"
rm -rf .next
bun run dev
```

### Testar APIs
```bash
# Testa login
curl -X POST http://localhost:81/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninja.local","password":"admin123"}'

# Testa debug
curl -s http://localhost:81/api/debug
```

---

## 🎉 Conclusão

O servidor está funcionando 100% após limpar o cache:
- ✅ Next.js rodando
- ✅ APIs operacionais
- ✅ Banco de dados conectado
- ✅ 3 usuários criados

**Ação necessária do usuário:**
- Limpar cache do navegador (Ctrl+Shift+R)
- Recarregar a página

Após isso, o preview URL deve funcionar perfeitamente!
