#!/bin/bash

# Script auxiliar para configurar GitHub remote
# Uso: bash /home/z/my-project/scripts/setup-github.sh

echo "========================================="
echo "  GitHub Remote Setup Script"
echo "========================================="
echo ""

cd /home/z/my-project

# Verificar se já existe remote
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' já configurado:"
    git remote -v
    echo ""
    read -p "Deseja remover e reconfigurar? (s/n): " confirm
    if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
        git remote remove origin
        echo "✅ Remote removido."
    else
        echo "❌ Operação cancelada."
        exit 0
    fi
fi

echo ""
echo "📝 Informe os dados do seu repositório GitHub:"
echo ""

# Solicitar URL do repositório
read -p "URL do repositório (ex: https://github.com/user/repo.git): " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ URL não informada. Operação cancelada."
    exit 1
fi

# Adicionar remote
echo ""
echo "🔧 Adicionando remote..."
git remote add origin "$repo_url"

# Verificar
echo ""
echo "✅ Remote configurado:"
git remote -v

echo ""
echo "========================================="
echo "  Próximos Passos:"
echo "========================================="
echo ""
echo "1. Execute o push:"
echo "   git push -u origin master"
echo ""
echo "2. Quando solicitado:"
echo "   - Username: seu usuário do GitHub"
echo "   - Password: cole seu TOKEN de acesso"
echo ""
echo "========================================="
echo ""
