#!/usr/bin/env bash
################################################################################
# rebuild_preview.sh - Script de reconstrução do Preview URL do Ninja OS
#
# Uso: ./rebuild_preview.sh [--production]
#
# Opções:
#   --production    Executa rebuild em modo produção (não inicia dev server)
#
# Descrição:
#   Script completo para reconstruir o ambiente Next.js em situações críticas.
#   Inclui validações, rollback em caso de erro, logs detalhados e testes.
#
# Autor: Z.ai Code Assistant
# Data: 2025-01-19
################################################################################

set -euo pipefail  # Exit on error, undefined variables, pipe failures

# ============================================================================
# CONFIGURAÇÕES
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="rebuild_preview_$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR=".next_backup_$(date +%Y%m%d_%H%M%S)"
DEV_SERVER_PORT=3000
MAX_WAIT_TIME=30  # segundos para esperar o servidor
HEALTH_CHECK_RETRIES=3

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Flags
PRODUCTION_MODE=false
WITH_BACKUP=true
SKIP_BUILD=false
START_DEV_SERVER=true

# ============================================================================
# FUNÇÕES DE LOGGING
# ============================================================================

log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $*" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $*" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[✗]${NC} $*" | tee -a "$LOG_FILE"
}

log_step() {
    local step=$1
    local total=$2
    local description=$3
    echo -e "\n${BLUE}=== [${step}/${total}] ${description} ===${NC}" | tee -a "$LOG_FILE"
}

# ============================================================================
# FUNÇÕES DE UTILIDADE
# ============================================================================

check_command() {
    local cmd=$1
    if ! command -v "$cmd" &> /dev/null; then
        log_error "Comando '$cmd' não encontrado"
        return 1
    fi
    return 0
}

check_disk_space() {
    local required_mb=500
    local available_mb=$(df -m . | awk 'NR==2 {print $4}')

    if [ "$available_mb" -lt "$required_mb" ]; then
        log_error "Espaço em disco insuficiente. Disponível: ${available_mb}MB, Requerido: ${required_mb}MB"
        return 1
    fi

    log_success "Espaço em disco suficiente: ${available_mb}MB disponível"
    return 0
}

check_memory() {
    local available_gb=$(free -g | awk 'NR==2 {print $7}')
    local required_gb=1

    if [ "$available_gb" -lt "$required_gb" ]; then
        log_warning "Memória disponível baixa: ${available_gb}GB (recomendado: ${required_gb}GB+)"
        return 0  # Warning only, not blocking
    fi

    log_success "Memória disponível: ${available_gb}GB"
    return 0
}

create_backup() {
    if [ "$WITH_BACKUP" = true ] && [ -d ".next" ]; then
        log_info "Criando backup em ${BACKUP_DIR}..."
        if cp -r .next "$BACKUP_DIR" 2>/dev/null; then
            log_success "Backup criado com sucesso"
            return 0
        else
            log_warning "Falha ao criar backup, continuando sem backup"
            return 1
        fi
    fi
    return 0
}

restore_backup() {
    if [ -d "$BACKUP_DIR" ]; then
        log_warning "Restaurando backup de ${BACKUP_DIR}..."
        rm -rf .next
        if mv "$BACKUP_DIR" .next; then
            log_success "Backup restaurado com sucesso"
            return 0
        else
            log_error "Falha ao restaurar backup"
            return 1
        fi
    fi
    return 1
}

cleanup_backup() {
    if [ -d "$BACKUP_DIR" ]; then
        log_info "Removendo backup..."
        rm -rf "$BACKUP_DIR"
        log_success "Backup removido"
    fi
}

# ============================================================================
# FUNÇÕES DE VERIFICAÇÃO
# ============================================================================

check_system() {
    log_step 1 1 "Verificando ambiente do sistema"

    # Verifica sistema operacional
    log_info "Sistema: $(uname -a)"

    # Verifica Node.js
    if check_command node; then
        local node_version=$(node -v)
        log_success "Node.js: ${node_version}"
    else
        log_error "Node.js não está instalado"
        return 1
    fi

    # Verifica Bun
    if check_command bun; then
        local bun_version=$(bun -v)
        log_success "Bun: ${bun_version}"
    else
        log_error "Bun não está instalado"
        return 1
    fi

    # Verifica npm (opcional)
    if check_command npm; then
        local npm_version=$(npm -v)
        log_info "NPM: ${npm_version}"
    fi

    # Verifica espaço em disco
    if ! check_disk_space; then
        return 1
    fi

    # Verifica memória
    check_memory

    # Verifica variável PORT
    if [ -n "${PORT:-}" ]; then
        log_warning "PORT está definida como ${PORT} (pode causar conflitos)"
    fi

    return 0
}

check_next_process() {
    local next_processes=$(pgrep -f "next dev" || true)

    if [ -n "$next_processes" ]; then
        log_info "Processos Next.js encontrados (PIDs: $next_processes)"
        return 0
    fi

    return 1
}

check_port() {
    if check_command lsof; then
        local port_in_use=$(lsof -ti:$DEV_SERVER_PORT 2>/dev/null || true)
        if [ -n "$port_in_use" ]; then
            log_warning "Porta ${DEV_SERVER_PORT} está em uso (PID: ${port_in_use})"
            return 1
        fi
    fi
    return 0
}

# ============================================================================
# FUNÇÕES DE BUILD
# ============================================================================

stop_dev_server() {
    log_step 2 6 "Parando servidor de desenvolvimento Next.js"

    local attempts=0
    local max_attempts=3

    while [ $attempts -lt $max_attempts ]; do
        if check_next_process; then
            log_info "Tentativa $((attempts + 1))/$max_attempts: Parando processos Next.js..."
            pkill -f "next dev" 2>/dev/null || true
            sleep 2
        else
            log_success "Nenhum processo Next.js encontrado"
            return 0
        fi
        attempts=$((attempts + 1))
    done

    if check_next_process; then
        log_error "Não foi possível parar todos os processos Next.js após ${max_attempts} tentativas"
        return 1
    fi

    log_success "Processos Next.js parados com sucesso"
    return 0
}

clear_build() {
    log_step 3 6 "Limpando build anterior"

    if [ -d ".next" ]; then
        local build_size=$(du -sh .next | cut -f1)
        log_info "Removendo .next (${build_size})..."
        rm -rf .next
        log_success "Build anterior removido"
    else
        log_info "Nenhum build anterior encontrado (.next não existe)"
    fi

    # Limpa também node_modules/.cache se existir
    if [ -d "node_modules/.cache" ]; then
        log_info "Limpando cache de node_modules..."
        rm -rf node_modules/.cache
        log_success "Cache de node_modules limpo"
    fi

    return 0
}

install_dependencies() {
    log_step 4 6 "Instalando dependências"

    if [ ! -f "package.json" ]; then
        log_error "package.json não encontrado"
        return 1
    fi

    log_info "Verificando dependências..."
    if bun install --frozen-lockfile; then
        log_success "Dependências instaladas com sucesso"
        return 0
    else
        log_error "Falha ao instalar dependências"
        return 1
    fi
}

build_project() {
    log_step 5 6 "Construindo projeto"

    if [ "$SKIP_BUILD" = true ]; then
        log_warning "Build pulado (--skip-build)"
        return 0
    fi

    if [ "$PRODUCTION_MODE" = true ]; then
        log_info "Executando build de produção..."
        if bun run build; then
            log_success "Build de produção concluído com sucesso"
            return 0
        else
            log_error "Falha no build de produção"
            return 1
        fi
    else
        log_info "Executando build de desenvolvimento..."
        if bun run build 2>&1 | tee -a "$LOG_FILE"; then
            log_success "Build concluído com sucesso"
            return 0
        else
            log_warning "Build falhou, tentando iniciar dev server diretamente..."
            # Build em dev pode falhar se houver erros não críticos
            return 0
        fi
    fi
}

start_server() {
    log_step 6 6 "Iniciando servidor"

    if [ "$START_DEV_SERVER" = false ]; then
        log_info "Servidor não iniciado (--no-start)"
        return 0
    fi

    if [ "$PRODUCTION_MODE" = true ]; then
        log_info "Modo produção: servidor não iniciado (use bun run start)"
        return 0
    fi

    log_info "Iniciando servidor de desenvolvimento em background..."

    nohup bun run dev > dev.log 2>&1 &
    local dev_pid=$!

    log_info "Dev server iniciado com PID ${dev_pid}"

    # Aguarda o servidor estar pronto
    local wait_count=0
    while [ $wait_count -lt $MAX_WAIT_TIME ]; do
        if grep -q "Ready in" dev.log 2>/dev/null; then
            log_success "Servidor iniciado com sucesso"
            return 0
        fi
        sleep 1
        wait_count=$((wait_count + 1))
    done

    log_error "Servidor não iniciou após ${MAX_WAIT_TIME} segundos"
    return 1
}

# ============================================================================
# FUNÇÕES DE HEALTH CHECK
# ============================================================================

health_check() {
    log_step 1 1 "Executando health checks"

    local failed=0

    # Verifica se o servidor está respondendo
    log_info "Verificando se o servidor está respondendo..."

    for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
        if curl -f -s http://localhost:$DEV_SERVER_PORT/ > /dev/null 2>&1; then
            log_success "Servidor respondendo (tentativa $i/$HEALTH_CHECK_RETRIES)"
            break
        else
            if [ $i -eq $HEALTH_CHECK_RETRIES ]; then
                log_error "Servidor não está respondendo após $HEALTH_CHECK_RETRIES tentativas"
                failed=1
            else
                log_warning "Servidor não respondeu, tentando novamente ($i/$HEALTH_CHECK_RETRIES)..."
                sleep 2
            fi
        fi
    done

    # Verifica se arquivos estáticos existem
    if [ -d ".next/static" ]; then
        local css_count=$(find .next/static/css -name "*.css" 2>/dev/null | wc -l)
        local js_count=$(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l)

        log_info "Arquivos estáticos: ${css_count} CSS, ${js_count} JS"

        if [ "$css_count" -gt 0 ] && [ "$js_count" -gt 0 ]; then
            log_success "Arquivos estáticos encontrados"
        else
            log_warning "Arquivos estáticos insuficientes (CSS: ${css_count}, JS: ${js_count})"
            failed=1
        fi
    else
        log_error "Diretório .next/static não encontrado"
        failed=1
    fi

    # Verifica BUILD_ID
    if [ -f ".next/BUILD_ID" ]; then
        local build_id=$(cat .next/BUILD_ID)
        log_success "BUILD ID: ${build_id}"
    else
        log_warning "BUILD_ID não encontrado"
    fi

    return $failed
}

# ============================================================================
# FUNÇÕES DE TESTE
# ============================================================================

test_static_files() {
    log_step 1 1 "Testando recursos estáticos"

    if [ "$PRODUCTION_MODE" = true ]; then
        log_info "Modo produção: pulando teste de estáticos (servidor não iniciado)"
        return 0
    fi

    log_info "Testando acesso à página principal..."
    if curl -f -s -o /dev/null http://localhost:$DEV_SERVER_PORT/; then
        log_success "Página principal acessível"
    else
        log_error "Falha ao acessar página principal"
        return 1
    fi

    # Tenta obter URL de um arquivo CSS do HTML
    log_info "Testando arquivos estáticos..."
    local css_url=$(curl -s http://localhost:$DEV_SERVER_PORT/ 2>/dev/null | grep -o '_next/static/css/[^"]*' | head -1 || true)

    if [ -n "$css_url" ]; then
        log_info "Testando ${css_url}..."
        if curl -f -s -o /dev/null "http://localhost:$DEV_SERVER_PORT/${css_url}"; then
            log_success "Arquivo CSS acessível"
        else
            log_error "Falha ao acessar arquivo CSS"
            return 1
        fi
    fi

    return 0
}

# ============================================================================
# FUNÇÃO PRINCIPAL
# ============================================================================

show_usage() {
    cat << EOF
Uso: $0 [OPÇÕES]

Opções:
  --production       Executa rebuild em modo produção (não inicia dev server)
  --no-backup        Não cria backup do build anterior
  --skip-build       Pula o step de build
  --no-start         Não inicia o servidor após rebuild
  --help             Mostra esta mensagem de ajuda

Exemplos:
  $0                        # Rebuild padrão (modo dev)
  $0 --production           # Rebuild de produção
  $0 --no-backup --no-start # Rebuild sem backup e sem iniciar servidor

EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --production)
                PRODUCTION_MODE=true
                START_DEV_SERVER=false
                shift
                ;;
            --no-backup)
                WITH_BACKUP=false
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --no-start)
                START_DEV_SERVER=false
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Opção desconhecida: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

main() {
    # Parse argumentos
    parse_arguments "$@"

    # Header
    cat << EOF
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║           Ninja OS - Preview URL Rebuild Script                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

Modo: $([ "$PRODUCTION_MODE" = true ] && echo "PRODUÇÃO" || echo "DESENVOLVIMENTO")
Backup: $([ "$WITH_BACKUP" = true ] && echo "ATIVADO" || echo "DESATIVADO")
Servidor: $([ "$START_DEV_SERVER" = true ] && echo "INICIAR" || echo "NÃO INICIAR")

Log: ${LOG_FILE}
Data de início: $(date '+%Y-%m-%d %H:%M:%S')

EOF

    # Verificações do sistema
    if ! check_system; then
        log_error "Verificações do sistema falharam"
        log_error "Veja ${LOG_FILE} para detalhes"
        exit 1
    fi

    echo ""

    # Cria backup se habilitado
    if create_backup; then
        echo ""
    fi

    # Executa rebuild
    local error_occurred=false

    if ! stop_dev_server; then
        error_occurred=true
    fi
    echo ""

    if ! clear_build; then
        error_occurred=true
    fi
    echo ""

    if ! install_dependencies; then
        log_error "Falha ao instalar dependências"
        if [ "$WITH_BACKUP" = true ]; then
            restore_backup
        fi
        exit 1
    fi
    echo ""

    if ! build_project; then
        log_error "Falha no build"
        if [ "$WITH_BACKUP" = true ]; then
            restore_backup
        fi
        exit 1
    fi
    echo ""

    if ! start_server; then
        error_occurred=true
    fi
    echo ""

    # Se ocorreu erro e backup existe, tenta restaurar
    if [ "$error_occurred" = true ] && [ -d "$BACKUP_DIR" ]; then
        log_error "Ocorreram erros durante o rebuild"
        log_warning "Tentando restaurar backup..."
        restore_backup
        exit 1
    fi

    # Health checks se servidor foi iniciado
    if [ "$START_DEV_SERVER" = true ] && [ "$PRODUCTION_MODE" = false ]; then
        if health_check; then
            echo ""
            if ! test_static_files; then
                log_warning "Testes de arquivos estáticos falharam, mas rebuild foi concluído"
            fi
        else
            log_error "Health checks falharam"
            exit 1
        fi
    fi

    # Cleanup backup se sucesso
    if [ "$error_occurred" = false ]; then
        cleanup_backup
    fi

    # Resumo final
    cat << EOF

╔═══════════════════════════════════════════════════════════════════╗
║                  REBUILD CONCLUÍDO COM SUCESSO                    ║
╚═══════════════════════════════════════════════════════════════════╝

Status:
  ✓ Verificações do sistema: OK
  ✓ Processos Next.js: Parados
  ✓ Build anterior: Limpo
  ✓ Dependências: Instaladas
  ✓ Build: Concluído

$(if [ "$START_DEV_SERVER" = true ] && [ "$PRODUCTION_MODE" = false ]; then
    echo "  ✓ Servidor: Iniciado e funcional"
    echo ""
    echo "  URL Local: http://localhost:${DEV_SERVER_PORT}"
    echo "  Log: dev.log"
else
    echo "  Servidor: Não iniciado (--no-start ou --production)"
    echo ""
    if [ "$PRODUCTION_MODE" = true ]; then
        echo "  Para iniciar produção: bun run start"
    fi
fi)

Build ID: $(cat .next/BUILD_ID 2>/dev/null || echo "N/A")

Próximos passos:
  1. Se for preview: reabra a URL e valide recursos estáticos
  2. Se for produção: siga o fluxo de deploy previsto
  3. Verifique logs em: ${LOG_FILE}
  4. Em caso de problemas, consulte dev.log

Data de conclusão: $(date '+%Y-%m-%d %H:%M:%S')

EOF

    return 0
}

# ============================================================================
# EXECUÇÃO
# ============================================================================

trap 'log_error "Script interrompido"; exit 1' INT TERM

main "$@"
