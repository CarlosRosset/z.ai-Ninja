# Exemplo de Execução do rebuild_preview.sh

Este documento mostra um exemplo real de execução do script `rebuild_preview.sh`.

---

## Exemplo 1: Rebuild Bem-Sucedido

```bash
$ ./rebuild_preview.sh

╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║           Ninja OS - Preview URL Rebuild Script                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

Modo: DESENVOLVIMENTO
Backup: ATIVADO
Servidor: INICIAR

Log: rebuild_preview_20250119_003500.log
Data de início: 2025-01-19 00:35:00

2025-01-19 00:35:00 [INFO] === [1/1] Verificando ambiente do sistema ===
2025-01-19 00:35:00 [INFO] Sistema: Linux c-696d3167-148f475d-0ebc0882efed 5.10.134-013.5.kangaroo.al8.x86_64 #1 SMP Thu Nov 20 02:46:27 UTC 2025 x86_64 GNU/Linux
2025-01-19 00:35:00 [✓] Node.js: v24.13.0
2025-01-19 00:35:00 [✓] Bun: 1.3.6
2025-01-19 00:35:00 [INFO] NPM: 11.6.2
2025-01-19 00:35:00 [✓] Espaço em disco suficiente: 7471MB disponível
2025-01-19 00:35:00 [✓] Memória disponível: 7GB

2025-01-19 00:35:00 [INFO] Criando backup em .next_backup_20250119_003500...
2025-01-19 00:35:01 [✓] Backup criado com sucesso

2025-01-19 00:35:01 [INFO] === [2/6] Parando servidor de desenvolvimento Next.js ===
2025-01-19 00:35:01 [INFO] Processos Next.js encontrados (PIDs: 3353)
2025-01-19 00:35:01 [INFO] Tentativa 1/3: Parando processos Next.js...
2025-01-19 00:35:03 [✓] Processos Next.js parados com sucesso

2025-01-19 00:35:03 [INFO] === [3/6] Limpando build anterior ===
2025-01-19 00:35:03 [INFO] Removendo .next (52M)...
2025-01-19 00:35:04 [✓] Build anterior removido
2025-01-19 00:35:04 [INFO] Limpando cache de node_modules...
2025-01-19 00:35:04 [✓] Cache de node_modules limpo

2025-01-19 00:35:04 [INFO] === [4/6] Instalando dependências ===
2025-01-19 00:35:04 [INFO] Verificando dependências...
bun add v1.3.6 (<https://bun.sh>)
Saved lockfile
+0 packages installed
2025-01-19 00:35:15 [✓] Dependências instaladas com sucesso

2025-01-19 00:35:15 [INFO] === [5/6] Construindo projeto ===
2025-01-19 00:35:15 [INFO] Executando build de desenvolvimento...

 ▲ Next.js 15.3.5
 - Local:        http://localhost:3000
 - Network:      http://21.0.11.153:3000
 - Environments: .env

 ✓ Starting...
 ✓ Ready in 1198ms
 ○ Compiling / ...
 ✓ Compiled / in 3.3s (883 modules)

2025-01-19 00:35:25 [✓] Build concluído com sucesso

2025-01-19 00:35:25 [INFO] === [6/6] Iniciando servidor ===
2025-01-19 00:35:25 [INFO] Iniciando servidor de desenvolvimento em background...
2025-01-19 00:35:25 [INFO] Dev server iniciado com PID 9999
2025-01-19 00:35:30 [✓] Servidor iniciado com sucesso

2025-01-19 00:35:30 [INFO] === [1/1] Executando health checks ===
2025-01-19 00:35:30 [INFO] Verificando se o servidor está respondendo...
2025-01-19 00:35:31 [✓] Servidor respondendo (tentativa 1/3)
2025-01-19 00:35:31 [INFO] Arquivos estáticos: 2 CSS, 18 JS
2025-01-19 00:35:31 [✓] Arquivos estáticos encontrados
2025-01-19 00:35:31 [✓] BUILD ID: -iM0coXYjK4aswJUYicvH

2025-01-19 00:35:31 [INFO] === [1/1] Testando recursos estáticos ===
2025-01-19 00:35:31 [INFO] Testando acesso à página principal...
2025-01-19 00:35:32 [✓] Página principal acessível
2025-01-19 00:35:32 [INFO] Testando _next/static/css/app/layout.css?v=1768782881961...
2025-01-19 00:35:32 [✓] Arquivo CSS acessível
2025-01-19 00:35:32 [INFO] Removendo backup...
2025-01-19 00:35:32 [✓] Backup removido

╔═══════════════════════════════════════════════════════════════════╗
║                  REBUILD CONCLUÍDO COM SUCESSO                    ║
╚═══════════════════════════════════════════════════════════════════╝

Status:
  ✓ Verificações do sistema: OK
  ✓ Processos Next.js: Parados
  ✓ Build anterior: Limpo
  ✓ Dependências: Instaladas
  ✓ Build: Concluído
  ✓ Servidor: Iniciado e funcional

  URL Local: http://localhost:3000
  Log: dev.log

Build ID: -iM0coXYjK4aswJUYicvH

Próximos passos:
  1. Se for preview: reabra a URL e valide recursos estáticos
  2. Se for produção: siga o fluxo de deploy previsto
  3. Verifique logs em: rebuild_preview_20250119_003500.log
  4. Em caso de problemas, consulte dev.log

Data de conclusão: 2025-01-19 00:35:32
```

---

## Exemplo 2: Rebuild com Erro e Rollback

```bash
$ ./rebuild_preview.sh

╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║           Ninja OS - Preview URL Rebuild Script                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

...

2025-01-19 00:40:00 [✓] Backup criado com sucesso
2025-01-19 00:40:01 [✓] Processos Next.js parados com sucesso
2025-01-19 00:40:02 [✓] Build anterior removido
2025-01-19 00:40:03 [✓] Cache de node_modules limpo

2025-01-19 00:40:03 [INFO] === [4/6] Instalando dependências ===
2025-01-19 00:40:03 [INFO] Verificando dependências...
error: package "fake-package@999.0.0" not found

2025-01-19 00:40:10 [✗] Falha ao instalar dependências
2025-01-19 00:40:10 [INFO] Veja rebuild_preview_20250119_004000.log para detalhes
2025-01-19 00:40:10 [!] Ocorreram erros durante o rebuild
2025-01-19 00:40:10 [!] Tentando restaurar backup...
2025-01-19 00:40:11 [✓] Backup restaurado com sucesso
```

**Neste exemplo:**
1. O script detectou erro ao instalar dependências
2. Automaticamente restaurou o backup
3. O build anterior foi recuperado
4. Nenhum dano foi causado

---

## Exemplo 3: Rebuild em Modo Produção

```bash
$ ./rebuild_preview.sh --production

╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║           Ninja OS - Preview URL Rebuild Script                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

Modo: PRODUÇÃO
Backup: ATIVADO
Servidor: NÃO INICIAR

...

2025-01-19 00:45:00 [INFO] === [5/6] Construindo projeto ===
2025-01-19 00:45:00 [INFO] Executando build de produção...

 ▲ Next.js 15.3.5
 Creating an optimized production build...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (6/6)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    8.8 kB        91.3 kB
├ ○ /_not-found                          871 B         83.2 kB
└ ○ /api/me                             3.4 kB        86 kB

○  (Static)   prerendered as static content

2025-01-19 00:46:30 [✓] Build de produção concluído com sucesso

...

╔═══════════════════════════════════════════════════════════════════╗
║                  REBUILD CONCLUÍDO COM SUCESSO                    ║
╚═══════════════════════════════════════════════════════════════════╝

Status:
  ✓ Verificações do sistema: OK
  ✓ Processos Next.js: Parados
  ✓ Build anterior: Limpo
  ✓ Dependências: Instaladas
  ✓ Build: Concluído
  Servidor: Não iniciado (--no-start ou --production)

  Para iniciar produção: bun run start

Build ID: -iM0coXYjK4aswJUYicvH

Próximos passos:
  1. Se for preview: reabra a URL e valide recursos estáticos
  2. Se for produção: siga o fluxo de deploy previsto
  3. Verifique logs em: rebuild_preview_20250119_004500.log
  4. Em caso de problemas, consulte dev.log

Data de conclusão: 2025-01-19 00:46:32
```

**Após rebuild de produção:**

```bash
$ bun run start

# Servidor de produção iniciado
```

---

## Exemplo 4: Rebuild com Opções Combinadas

```bash
$ ./rebuild_preview.sh --no-backup --no-start

...

2025-01-19 00:50:00 [INFO] === [1/1] Verificando ambiente do sistema ===
...

2025-01-19 00:50:01 [INFO] === [2/6] Parando servidor de desenvolvimento Next.js ===
...

2025-01-19 00:50:02 [INFO] === [3/6] Limpando build anterior ===
2025-01-19 00:50:02 [INFO] Removendo .next (52M)...
2025-01-19 00:50:03 [✓] Build anterior removido

2025-01-19 00:50:03 [INFO] === [4/6] Instalando dependências ===
...
2025-01-19 00:50:15 [✓] Dependências instaladas com sucesso

2025-01-19 00:50:15 [INFO] === [5/6] Construindo projeto ===
...
2025-01-19 00:50:30 [✓] Build concluído com sucesso

2025-01-19 00:50:30 [INFO] === [6/6] Iniciando servidor ===
2025-01-19 00:50:30 [INFO] Servidor não iniciado (--no-start)

╔═══════════════════════════════════════════════════════════════════╗
║                  REBUILD CONCLUÍDO COM SUCESSO                    ║
╚═══════════════════════════════════════════════════════════════════╝

Status:
  ✓ Verificações do sistema: OK
  ✓ Processos Next.js: Parados
  ✓ Build anterior: Limpo
  ✓ Dependências: Instaladas
  ✓ Build: Concluído
  Servidor: Não iniciado (--no-start ou --production)

Build ID: -iM0coXYjK4aswJUYicvH

Próximos passos:
  1. Se for preview: reabra a URL e valide recursos estáticos
  2. Se for produção: siga o fluxo de deploy previsto
  3. Verifique logs em: rebuild_preview_20250119_005000.log
  4. Em caso de problemas, consulte dev.log
```

**Neste exemplo:**
- `--no-backup`: Nenhum backup foi criado (mais rápido, mas sem rollback)
- `--no-start`: Servidor não foi iniciado (você pode iniciar manualmente depois)

---

## Exemplo 5: Verificando Logs Após Rebuild

```bash
# Ver último log de rebuild
$ cat $(ls -t rebuild_preview_*.log | head -1)

2025-01-19 00:35:00 [INFO] === [1/1] Verificando ambiente do sistema ===
2025-01-19 00:35:00 [INFO] Sistema: Linux c-696d3167-148f475d-0ebc0882efed 5.10.134-013.5.kangaroo.al8.x86_64 #1 SMP Thu Nov 20 02:46:27 UTC 2025 x86_64 GNU/Linux
2025-01-19 00:35:00 [✓] Node.js: v24.13.0
...

# Ver dev.log
$ tail -n 50 dev.log

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://21.0.11.153:3000
   - Environments: .env

 ✓ Starting...
 ✓ Ready in 1198ms
 ○ Compiling / ...
 ✓ Compiled / in 3.3s (883 modules)
 GET / 200 in 30ms
 GET /_next/static/css/app/layout.css?v=1768782881961 200 in 10ms
 GET /_next/static/chunks/webpack.js?v=1768782881961 200 in 8ms
```

---

## Resumo dos Exemplos

| Exemplo | Modo | Backup | Servidor | Resultado |
|---------|------|--------|----------|-----------|
| 1 | Dev | Sim | Iniciado | ✅ Sucesso |
| 2 | Dev | Sim | Iniciado | ❌ Erro + Rollback |
| 3 | Produção | Sim | Não iniciado | ✅ Sucesso |
| 4 | Dev | Não | Não iniciado | ✅ Sucesso |

---

## Dicas de Uso

1. **Sempre use rebuild_preview.sh** em vez de comandos manuais
2. **Verifique os logs** após cada rebuild
3. **Use --no-backup** apenas se tiver certeza
4. **Use --production** para preparar deploy
5. **Use --no-start** para rebuilds em lote

---

**Última atualização:** 2025-01-19
**Versão do script:** 1.0.0
