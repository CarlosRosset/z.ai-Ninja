import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (apenas em dev)
  console.log('🗑️  Limpando dados existentes...')
  await prisma.auditLog.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()

  // Hash das senhas
  const passwordAdmin = await bcrypt.hash('admin123', 10)
  const passwordUser = await bcrypt.hash('user123', 10)

  // Criar superadmin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@ninja.local',
      name: 'Super Admin',
      password: passwordAdmin,
      role: UserRole.SUPERADMIN,
      avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712029.png',
      phone: '11999999999',
    },
  })
  console.log('✅ SuperAdmin criado:', superAdmin.email)

  // Criar usuário normal
  const normalUser = await prisma.user.create({
    data: {
      email: 'user@ninja.local',
      name: 'Usuário Teste',
      password: passwordUser,
      role: UserRole.USER,
      avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712076.png',
      phone: '11999999998',
    },
  })
  console.log('✅ Usuário normal criado:', normalUser.email)

  // Criar favorites para o usuário normal
  const favorites = [
    {
      userId: normalUser.id,
      title: 'Node.js Production',
      link: 'https://carlosrosset.dev',
      description: 'Ambiente de produção Next.js hospedado. Roteia tráfego web público via Traefik (Porta 443) com certificado SSL automático.',
      image: '/ninja-os/data/img/nodejs-logo.svg',
      category: 'prod',
    },
    {
      userId: normalUser.id,
      title: 'Gestão de Containers (Portainer)',
      link: 'https://portainer.carlosrosset.dev',
      description: 'Painel administrativo centralizado. Permite criar, gerir e monitorar todos os serviços Docker.',
      image: '/ninja-os/data/img/portainer-logo.svg',
      category: 'ops',
    },
    {
      userId: normalUser.id,
      title: 'Monitoramento de Servidor (Cockpit)',
      link: 'https://cockpit.carlosrosset.dev',
      description: 'Dashboard operacional do Sistema. Fornece visualização em tempo real de CPU, Memória e Disco.',
      image: '/ninja-os/data/img/cockpit-logo.png',
      category: 'mon',
    },
    {
      userId: normalUser.id,
      title: 'Gerenciamento de Infraestrutura (Hostinger)',
      link: 'https://hpanel.hostinger.com/vps/',
      description: 'Painel oficial do provedor VPS. Gerencia recursos de hardware e gestão financeira.',
      image: '/ninja-os/data/img/hostinger-logo.svg',
      category: 'infra',
    },
  ]

  for (const fav of favorites) {
    await prisma.favorite.create({ data: fav })
  }
  console.log(`✅ ${favorites.length} favorites criados para usuário:`)

  // Criar audit logs iniciais
  await prisma.auditLog.create({
    data: {
      action: 'REGISTER',
      userId: superAdmin.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Seed Script',
      details: JSON.stringify({ method: 'seed' }),
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'REGISTER',
      userId: normalUser.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Seed Script',
      details: JSON.stringify({ method: 'seed' }),
    },
  })

  console.log('✅ Audit logs criados')
  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('Credenciais de teste:')
  console.log('  SuperAdmin: admin@ninja.local / admin123')
  console.log('  Usuário:    user@ninja.local  / user123')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
