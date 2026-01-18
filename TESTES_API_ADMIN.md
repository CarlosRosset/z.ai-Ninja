# Testes de API - Usuário Admin

## Data: 2026-01-18

## Credenciais Admin
- **Email**: `admin@ninja.local`
- **Senha**: `admin123`
- **Role**: `SUPERADMIN`

---

## ✅ Testes Realizados

### 1. POST /api/auth/login - Login
**Status**: ✅ PASSOU

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninja.local","password":"admin123"}'
```

**Response**:
```json
{
  "ok": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmkjzoln40000xtpjd6li1ect",
    "email": "admin@ninja.local",
    "name": "Super Admin",
    "role": "SUPERADMIN",
    "avatar": "https://cdn-icons-png.flaticon.com/512/4712/4712029.png"
  }
}
```

---

### 2. GET /api/me - Obter Dados do Usuário
**Status**: ✅ PASSOU

**Request**:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/me
```

**Response**:
```json
{
  "ok": true,
  "user": {
    "id": "cmkjzoln40000xtpjd6li1ect",
    "email": "admin@ninja.local",
    "name": "Super Admin",
    "role": "SUPERADMIN",
    "avatar": "https://cdn-icons-png.flaticon.com/512/4712/4712029.png",
    "phone": "11999999999",
    "createdAt": "2026-01-18T17:07:28.528Z"
  }
}
```

---

### 3. GET /api/favorites - Listar Favoritos
**Status**: ✅ PASSOU

**Request**:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/favorites
```

**Response** (inicial):
```json
{
  "ok": true,
  "favorites": []
}
```

---

### 4. POST /api/favorites - Criar Favorito
**Status**: ✅ PASSOU

**Request**:
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste Admin",
    "link": "https://test.admin.com",
    "description": "Favorito de teste para admin"
  }'
```

**Response**:
```json
{
  "ok": true,
  "favorite": {
    "id": "cmkk00rsh0005xt7naiaqxb1s",
    "title": "Teste Admin",
    "link": "https://test.admin.com",
    "description": "Favorito de teste para admin",
    "image": null,
    "category": null,
    "userId": "cmkjzoln40000xtpjd6li1ect",
    "createdAt": "2026-01-18T17:16:56.370Z",
    "updatedAt": "2026-01-18T17:16:56.370Z"
  }
}
```

---

### 5. GET /api/favorites - Listar Favoritos (após criação)
**Status**: ✅ PASSOU

**Response**:
```json
{
  "ok": true,
  "favorites": [
    {
      "id": "cmkk00rsh0005xt7naiaqxb1s",
      "title": "Teste Admin",
      "link": "https://test.admin.com",
      "description": "Favorito de teste para admin",
      "image": null,
      "category": null,
      "userId": "cmkjzoln40000xtpjd6li1ect",
      "createdAt": "2026-01-18T17:16:56.370Z",
      "updatedAt": "2026-01-18T17:16:56.370Z"
    }
  ]
}
```

---

### 6. POST /api/auth/refresh - Refresh Token
**Status**: ✅ PASSOU (após correção de bug)

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt
```

**Response**:
```json
{
  "ok": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 7. POST /api/auth/logout - Logout
**Status**: ✅ PASSOU

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

**Response**:
```json
{
  "ok": true
}
```

---

### 8. POST /api/auth/register - Registro de Novo Usuário
**Status**: ✅ PASSOU

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ninja.local",
    "password": "test123",
    "name": "Test User"
  }'
```

**Response**:
```json
{
  "ok": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmkk01cnk000ext7n40sdqbo4",
    "email": "test@ninja.local",
    "name": "Test User",
    "role": "USER",
    "avatar": null
  }
}
```

---

### 9. POST /api/auth/login - Senha Incorreta
**Status**: ✅ PASSOU (validação funcionando)

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninja.local","password":"senhaerrada"}'
```

**Response**:
```json
{
  "ok": false,
  "error": "Credenciais inválidas"
}
```

---

### 10. GET /api/favorites - Sem Token
**Status**: ✅ PASSOU (proteção funcionando)

**Request**:
```bash
curl http://localhost:3000/api/favorites
```

**Response**:
```json
{
  "ok": false,
  "error": "Não autenticado"
}
```

---

### 11. GET /api/favorites - Token Inválido
**Status**: ✅ PASSOU (validação funcionando)

**Request**:
```bash
curl -H "Authorization: Bearer token-invalido" \
  http://localhost:3000/api/favorites
```

**Response**:
```json
{
  "ok": false,
  "error": "Token inválido"
}
```

---

### 12. POST /api/auth/recover - Recuperação de Senha
**Status**: ✅ PASSOU

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/recover \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninja.local"}'
```

**Response**:
```json
{
  "ok": true,
  "message": "Instruções de recuperação enviadas com sucesso"
}
```

---

### 13. POST /api/auth/change-password - Mudança de Senha
**Status**: ✅ PASSOU (após correção de bug)

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "test123",
    "newPassword": "novaSenha123"
  }'
```

**Response**:
```json
{
  "ok": true,
  "message": "Senha alterada com sucesso"
}
```

---

## 🔧 Correções Aplicadas Durante os Testes

### 1. Bug na rota /api/favorites
**Problema**: Acesso a `error.errors[0].message` quando pode não haver erros
**Correção**: Adicionado optional chaining `error.errors[0]?.message || 'Erro de validação'`
**Arquivo**: `src/app/api/favorites/route.ts`

### 2. Bug na rota /api/auth/refresh
**Problema**: Payload já tem `exp` e conflita com `expiresIn` ao gerar novo access token
**Correção**: Extrair apenas campos necessários do payload sem `exp` e `iat`
**Arquivo**: `src/app/api/auth/refresh/route.ts`

### 3. Bug na rota /api/auth/change-password
**Problema**: Importação de função inexistente `verifyAccessToken`
**Correção**: Trocar para `verifyToken` que existe em `@/lib/auth`
**Arquivo**: `src/app/api/auth/change-password/route.ts`

---

## 📊 Resumo

| Endpoint | Status | Observações |
|----------|--------|-------------|
| POST /api/auth/login | ✅ | Funcionando corretamente |
| GET /api/me | ✅ | Retorna dados do usuário autenticado |
| POST /api/auth/register | ✅ | Cria usuário com role USER por padrão |
| POST /api/auth/logout | ✅ | Remove refresh token do banco |
| POST /api/auth/refresh | ✅ | Gera novo access token válido |
| POST /api/auth/recover | ✅ | Retorna mensagem de sucesso |
| POST /api/auth/change-password | ✅ | Valida senha atual e atualiza |
| GET /api/favorites | ✅ | Lista favoritos do usuário |
| POST /api/favorites | ✅ | Cria favorito com validação Zod |

**Total de Testes**: 13
**Aprovados**: 13
**Reprovados**: 0
**Bugs Corrigidos**: 3

---

## 📝 Observações Importantes

1. **Access Token**: Válido por 15 minutos
2. **Refresh Token**: Válido por 30 dias
3. **Proteção de Rotas**: Todas as rotas de API protegidas exigem token válido
4. **Validação**: Zod schema validando dados de entrada em favoritos
5. **Role-Based Access**: Admin tem role SUPERADMIN (nível 4)
6. **Auditoria**: Logs de auditoria criados para ações sensíveis

---

## 🚀 Próximos Passos Sugeridos

1. Implementar endpoints PUT e DELETE para /api/favorites
2. Adicionar endpoint para listar todos os usuários (apenas para admins)
3. Implementar reset de senha com token de recuperação
4. Adicionar paginação na listagem de favoritos
5. Implementar upload de avatar de usuário
