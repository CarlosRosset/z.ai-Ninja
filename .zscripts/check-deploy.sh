#!/bin/bash

# Script para verificar o que está sendo deployado no servidor de produção

echo "🔍 Verificando ambiente de deploy..."
echo ""

# 1. Verificar se servidor de produção está rodando
echo "1️⃣ Processos Next.js:"
ps aux | grep -E "next-server|node.*next" | grep -v grep | awk '{print "   PID:", $2, "CMD:", $11, $12, $13}'

# 2. Verificar portas em uso
echo ""
echo "2️⃣ Portas em uso:"
netstat -tlnp 2>/dev/null | grep LISTEN | grep -E "(3000|80|443)" || ss -tlnp 2>/dev/null | grep LISTEN | grep -E "(3000|80|443)"

# 3. Verificar diretórios
echo ""
echo "3️⃣ Diretórios:"
echo "   /home/z/my-project: $(ls -la /home/z/my-project 2>/dev/null | wc -l)"
echo "   .next: $(ls -la /home/z/my-project/.next 2>/dev/null | wc -l)"
echo "   db/: $(ls -la /home/z/my-project/db/ 2>/dev/null | wc -l)"

# 4. Verificar bancos de dados
echo ""
echo "4️⃣ Bancos de dados:"
find /home/z -name "*.db" -type f 2>/dev/null | grep -v node_modules | grep -v ".next" | head -5

# 5. Verificar .env
echo ""
echo "5️⃣ Environment Variables:"
if [ -f "/home/z/my-project/.env" ]; then
    echo "   DATABASE_URL: $(cat /home/z/my-project/.env)"
else
    echo "   .env não encontrado em /home/z/my-project"
fi

# 6. Verificar build.sh
echo ""
echo "6️⃣ build.sh:"
if [ -f "/home/z/my-project/.zscripts/build.sh" ]; then
    echo "   build.sh existe"
    grep -n "seed" /home/z/my-project/.zscripts/build.sh | head -3 || echo "   Seed NÃO encontrado no build.sh"
else
    echo "   build.sh não encontrado"
fi

echo ""
echo "✅ Verificação concluída!"
