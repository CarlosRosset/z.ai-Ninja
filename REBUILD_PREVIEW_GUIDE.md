# rebuild_preview.sh - Guia de Uso

Script robusto para reconstrução do Preview URL do Ninja OS em situações críticas.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso Básico](#uso-básico)
- [Opções Avançadas](#opções-avançadas)
- [Cenários de Uso](#cenários-de-uso)
- [Troubleshooting](#troubleshooting)
- [Logs e Diagnósticos](#logs-e-diagnósticos)

---

## Visão Geral

O `rebuild_preview.sh` é um script completo para reconstruir o ambiente Next.js quando há problemas como:

- Cache corrompido do Next.js (`.next/`)
- Erros 404 em recursos estáticos
- Servidor não iniciando
- Build falhando repetidamente
- Processos conflitantes

### Recursos

- ✅ **Validações pré-execução**: Sistema, disco, memória, comandos
- ✅ **Backup automático**: Salva build anterior antes de limpar
- ✅ **Rollback automático**: Restaura backup em caso de erro
- ✅ **Logs detalhados**: Registro completo de todas as operações
- ✅ **Health checks**: Verifica funcionamento após rebuild
- ✅ **Testes automáticos**: Valida arquivos estáticos e acessibilidade
- ✅ **Modo produção**: Suporte para rebuild de produção
- ✅ **Cores e feedback**: Output claro e colorido

---

## Pré-requisitos

### Sistema Operacional
- Linux (testado em Ubuntu, Alpine, Debian)

### Runtime
- Node.js v18+ (recomendado v24.13.0+)
- Bun 1.3+ (recomendado)

### Dependências
- `bash` (shell)
- `curl` (para health checks)
- `lsof` (opcional, para verificação de portas)
- `rm`, `cp`, `mv`, `df`, `free`, `grep`, `find` (comandos Unix padrão)

---

## Instalação

### 1. Tornar Executável (Opcional)

```bash
chmod +x rebuild_preview.sh
```

### 2. Verificar Permissões

```bash
ls -lh rebuild_preview.sh
```

Se não tiver permissão para executar, use:
```bash
bash rebuild_preview.sh
```

---

## Uso Básico

### Rebuild Padrão (Modo Desenvolvimento)

Este é o uso mais comum para o preview URL:

```bash
./rebuild_preview.sh
# ou
bash rebuild_preview.sh
```

**O que acontece:**
1. ✅ Verifica ambiente do sistema
2. ✅ Cria backup de `.next/`
3. ✅ Para o servidor de desenvolvimento
4. ✅ Limpa build anterior
5. ✅ Instala/atualiza dependências
6. ✅ Executa build do projeto
7. ✅ Inicia servidor de desenvolvimento
8. ✅ Executa health checks
9. ✅ Testa recursos estáticos
10. ✅ Remove backup (se sucesso)

---

## Opções Avançadas

### `--production`

Executa rebuild em modo produção (não inicia dev server):

```bash
./rebuild_preview.sh --production
```

**Quando usar:**
- Preparando para deploy em produção
- Testando build de produção
- Quando não precisa do dev server

**Diferenças:**
- Executa `bun run build` (build de produção)
- Não inicia servidor após rebuild
- Você deve iniciar manualmente: `bun run start`

---

### `--no-backup`

Pula a criação de backup:

```bash
./rebuild_preview.sh --no-backup
```

**Quando usar:**
- Espaço em disco limitado
- Build anterior não é importante
- Acelerar o processo

**Riscos:**
- Não há rollback em caso de erro
- Use com cuidado

---

### `--skip-build`

Pula o step de build:

```bash
./rebuild_preview.sh --skip-build
```

**Quando usar:**
- Apenas precisa limpar cache
- Já fez build manualmente
- Quer apenas reiniciar o servidor

---

### `--no-start`

Não inicia o servidor após rebuild:

```bash
./rebuild_preview.sh --no-start
```

**Quando usar:**
- Quer fazer rebuild mas não iniciar servidor agora
- Vai iniciar manualmente mais tarde
- Integração com scripts personalizados

---

### `--help`

Mostra mensagem de ajuda:

```bash
./rebuild_preview.sh --help
```

---

## Cenários de Uso

### Cenário 1: Cache Corrompido (Mais Comum)

**Sintomas:**
- 404 em recursos estáticos (`/_next/static/*`)
- Erros como "Cannot find module './xxx.js'"
- Build inconsistente

**Solução:**
```bash
./rebuild_preview.sh
```

---

### Cenário 2: Servidor Não Inicia

**Sintomas:**
- Dev server não responde
- Erros no `dev.log`
- Porta 3000 já em uso

**Solução:**
```bash
# Opção 1: Rebuild completo
./rebuild_preview.sh

# Opção 2: Apenas reiniciar (sem rebuild)
./rebuild_preview.sh --skip-build
```

---

### Cenário 3: Preparando para Deploy em Produção

**Sintomas:**
- N/A (preparação proativa)

**Solução:**
```bash
./rebuild_preview.sh --production
# Depois: bun run start
```

---

### Cenário 4: Espaço em Disco Limitado

**Sintomas:**
- Erro "No space left on device"
- Pouco espaço disponível

**Solução:**
```bash
# Sem backup para economizar espaço
./rebuild_preview.sh --no-backup

# Apenas limpar cache sem rebuild
rm -rf .next node_modules/.cache
```

---

### Cenário 5: Build Falhando Repetidamente

**Sintomas:**
- Build falha sempre
- Erros de compilação
- Dependências corrompidas

**Solução:**
```bash
# Rebuild completo com backup
./rebuild_preview.sh

# Se falhar, tentar sem cache:
rm -rf node_modules/.cache
./rebuild_preview.sh
```

---

## Troubleshooting

### Problema: Permissão Negada

**Erro:**
```
bash: ./rebuild_preview.sh: Permission denied
```

**Solução:**
```bash
# Tornar executável
chmod +x rebuild_preview.sh

# Ou usar bash diretamente
bash rebuild_preview.sh
```

---

### Problema: Espaço em Disco Insuficiente

**Erro:**
```
[✗] Espaço em disco insuficiente. Disponível: 100MB, Requerido: 500MB
```

**Solução:**
```bash
# Limpar arquivos desnecessários
rm -rf .next_backup_*
rm -rf node_modules/.cache

# Ou usar --no-backup
./rebuild_preview.sh --no-backup
```

---

### Problema: Servidor Não Inicia

**Erro:**
```
[✗] Servidor não iniciou após 30 segundos
```

**Solução:**
```bash
# Verificar logs
tail -n 50 dev.log

# Verificar se porta está em uso
lsof -ti:3000

# Verificar processos
ps aux | grep next

# Se necessário, matar processo manualmente
pkill -9 -f "next dev"
```

---

### Problema: Health Checks Falhando

**Erro:**
```
[✗] Health checks falharam
```

**Solução:**
```bash
# Verificar se servidor está respondendo
curl http://localhost:3000/

# Verificar logs
tail -n 100 dev.log

# Tentar reconstruir novamente
./rebuild_preview.sh
```

---

### Problema: Build Falha

**Erro:**
```
[✗] Falha no build de produção
```

**Solução:**
```bash
# Verificar erro específico no log
grep -i "error" rebuild_preview_*.log

# Tentar build manual para ver erro completo
bun run build

# Verificar dependências
bun install

# Se restore automático falhar, restaurar manualmente
cp -r .next_backup_* .next
```

---

## Logs e Diagnósticos

### Log Principal

Cada execução cria um log com timestamp:

```
rebuild_preview_20250119_123456.log
```

**Conteúdo do log:**
- Timestamp de cada operação
- Comandos executados
- Status de cada etapa
- Erros detalhados (se houver)
- Informações do sistema

### Log do Dev Server

O dev server escreve em `dev.log`:

```bash
# Ver últimas linhas
tail -n 50 dev.log

# Acompanhar em tempo real
tail -f dev.log

# Buscar erros
grep -i "error" dev.log
```

### Logs de Backup

Backups são criados com timestamp:

```
.next_backup_20250119_123456/
```

**Nota:** Backups são removidos automaticamente após sucesso.

---

## Boas Práticas

### 1. Sempre Use o Script

Use o script em vez de comandos manuais:
- ✅ `./rebuild_preview.sh`
- ❌ `rm -rf .next && bun run dev`

O script inclui validações e rollback automático.

---

### 2. Mantenha Backups por um Tempo

Se tiver espaço em disco suficiente, mantenha backups:

```bash
# O script remove backup após sucesso por padrão
# Para manter backup manualmente:
cp -r .next .next_backup_manual
./rebuild_preview.sh --no-backup
```

---

### 3. Monitore os Logs

Sempre verifique os logs após rebuild:

```bash
# Log do rebuild
cat rebuild_preview_*.log

# Log do servidor
tail -n 50 dev.log
```

---

### 4. Teste Após Rebuild

Valide que tudo está funcionando:

```bash
# Testar página principal
curl http://localhost:3000/

# Testar recursos estáticos
curl http://localhost:3000/_next/static/css/app/layout.css

# Acesse no navegador
# http://localhost:3000
```

---

### 5. Documente Problemas

Se encontrar problemas recorrentes:

```bash
# Anote o erro
echo "ERRO: [descrição]" >> troubleshooting.md

# Salve logs
cp rebuild_preview_*.log logs/erro_data/
cp dev.log logs/erro_data/
```

---

## Comparação: Script vs Manual

| Operação | Script | Manual |
|----------|--------|--------|
| Validar ambiente | ✅ Automático | ❌ Manual |
| Criar backup | ✅ Automático | ❌ Manual |
| Parar servidor | ✅ Automático | ❌ Manual |
| Limpar cache | ✅ Automático | ✅ Manual |
| Instalar deps | ✅ Automático | ❌ Manual |
| Build | ✅ Automático | ❌ Manual |
| Iniciar servidor | ✅ Automático | ❌ Manual |
| Health checks | ✅ Automático | ❌ Manual |
| Testar estáticos | ✅ Automático | ❌ Manual |
| Rollback em erro | ✅ Automático | ❌ Manual |
| Logs detalhados | ✅ Automático | ❌ Manual |

**Conclusão:** O script é MUITO mais seguro e completo.

---

## Comandos Úteis

### Ver Processos Next.js

```bash
ps aux | grep next
```

### Ver Porta 3000

```bash
lsof -ti:3000
# ou
netstat -tlnp | grep 3000
```

### Limpar Tudo

```bash
pkill -f "next dev"
rm -rf .next
rm -rf node_modules/.cache
rm -f dev.log
```

### Ver Tamanho do Build

```bash
du -sh .next
du -sh .next/static
du -sh node_modules
```

### Ver Logs Recentes

```bash
# Último rebuild
ls -lt rebuild_preview_*.log | head -1

# Ler último log
cat $(ls -t rebuild_preview_*.log | head -1)
```

---

## Perguntas Frequentes

### Q: Quando devo usar este script?

**R:** Sempre que tiver problemas com o preview URL ou dev server:
- 404 em recursos estáticos
- Cache corrompido
- Build falhando
- Servidor não iniciando

---

### Q: O script remove dados do banco?

**R:** NÃO. O script apenas trabalha com o build (`.next/`). O banco (`db/`) não é afetado.

---

### Q: Posso executar o script enquanto o projeto está rodando?

**R:** SIM. O script automaticamente para o servidor antes de reconstruir.

---

### Q: Quanto tempo demora o rebuild?

**R:** Depende do tamanho do projeto:
- Pequeno: 1-2 minutos
- Médio: 3-5 minutos
- Grande: 5-10 minutos

---

### Q: O script funciona em produção?

**R:** SIM. Use a opção `--production` para rebuild de produção.

---

### Q: O que acontece se o script falhar?

**R:** O script automaticamente:
1. Detecta o erro
2. Restaura o backup (se existir)
3. Loga o erro detalhadamente
4. Sai com código de erro

---

### Q: Posso executar múltiplos rebuilds seguidos?

**R:** SIM, mas não é recomendado. Se falhar repetidamente, há um problema mais sério que precisa ser investigado.

---

### Q: O script funciona em Windows?

**R:** NÃO. Este script é para Linux/Unix apenas. No Windows, use WSL ou Git Bash.

---

## Suporte

Se encontrar problemas não documentados aqui:

1. Verifique os logs: `rebuild_preview_*.log`
2. Verifique dev.log: `tail -n 100 dev.log`
3. Consulte o documento de troubleshooting acima
4. Contacte o suporte da z.ai

---

**Última atualização:** 2025-01-19
**Versão do script:** 1.0.0
**Autor:** Z.ai Code Assistant
