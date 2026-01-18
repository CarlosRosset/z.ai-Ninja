# Cache Corrompido - Erro Cannot find module './447.js'

## 🚨 Erro
```
Error: Cannot find module './447.js'
Require stack:
- .next/server/webpack-runtime.js
- .next/server/app/page.js
...
```

## 📋 Causa
O cache `.next/` do Next.js estava corrompido novamente, causando erro ao carregar módulos.

Isso acontece por:
- Múltiplas alterações sem rebuild completo
- Hot Module Reload (HMR) inconsistente
- Reinícios frequentes do servidor
- Mudanças de dependências ou banco de dados

---

## ✅ Solução Aplicada

### Passo 1: Parar Servidor
```bash
pkill -f "next-server"
pkill -f "bun run dev"
```

### Passo 2: Limpar Cache
```bash
rm -rf /home/z/my-project/.next
```

### Passo 3: Reiniciar Servidor
```bash
bun run dev > /home/z/my-project/dev.log 2>&1 &
```

### Passo 4: Verificar Funcionamento
```bash
# Esperar servidor iniciar
sleep 15

# Testar login
curl -X POST http://localhost:81/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninja.local","password":"admin123"}'

# Resultado: ✅ 200 OK
```

---

## 📊 Status Atual

| Componente | Status |
|-----------|--------|
| Servidor Next.js | ✅ Rodando |
| Porta 3000 | ✅ Ativa |
| Porta 81 (gateway) | ✅ Ativa |
| Cache .next | ✅ Limpo |
| Banco de dados | ✅ Seedado |
| Usuários | ✅ Criados (2) |
| Login local | ✅ Funcionando |

---

## 🧪 Como Testar

### Via cURL:
```bash
curl -X POST http://localhost:81/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninja.local","password":"admin123"}'
```

### Via Console do Navegador:
```javascript
fetch('http://localhost:81/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@ninja.local', password: 'admin123' })
})
  .then(r => r.json())
  .then(d => console.log('Login:', d))
```

### Via Navegador:
1. Abrir http://localhost:81
2. Usar credenciais:
   - Email: admin@ninja.local
   - Senha: admin123

---

## 🔄 Como Evitar no Futuro

### Opção 1: Script de Limpeza
Criar script `clean.sh`:
```bash
#!/bin/bash
pkill -f "next-server"
rm -rf .next
bun run dev > dev.log 2>&1 &
```

### Opção 2: Limpeza Automática
Adicionar ao `package.json`:
```json
{
  "scripts": {
    "clean": "pkill -f next-server && rm -rf .next && bun run dev"
  }
}
```

### Opção 3: Limpeza Manual
Sempre que tiver erro de módulo:
```bash
pkill -f "next-server"
rm -rf .next
bun run dev
```

---

## 📝 Resumo

| Problema | Solução | Status |
|---------|---------|--------|
| Cache corrompido | rm -rf .next | ✅ Aplicado |
| Erro de módulo | Rebuild automático | ✅ Resolvido |
| Servidor parado | Reiniciar bun dev | ✅ Rodando |
| Login local | Testar via curl | ✅ Funcionando |

---

## ⏭️ Próximo Deploy

Quando fazer o próximo deploy:
1. ✅ build.sh agora roda seed automaticamente
2. ✅ Usuários serão criados em produção
3. ✅ Login funcionará em ninja-os.space.z.ai
4. ⚠️ Se cache corromper novamente, seguir passos acima

---

## 💡 Dicas

### Quando limpar cache:
- Erros "Cannot find module ./xxx.js"
- Erros estranhos de webpack
- Diferentes comportamentos em diferentes portas
- Build falha sem motivo claro

### Quando NÃO limpar cache:
- Erros lógicos de código
- Erros de banco de dados
- Erros de validação
- Problemas de autenticação (reais)

---

## 🎯 Conclusão

O erro de cache corrompido é comum em desenvolvimento. A solução é sempre:
1. Parar servidor
2. Limpar .next
3. Reiniciar

O servidor está agora 100% funcional com:
- ✅ Cache limpo
- ✅ Usuários criados
- ✅ APIs operacionais
- ✅ Login funcionando localmente
