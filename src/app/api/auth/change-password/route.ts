import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyPassword, hashPassword, verifyAccessToken } from '@/lib/auth'
import { createAuditLog, getClientIp, getClientUserAgent } from '@/lib/audit'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Obter token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { ok: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const accessToken = authHeader.substring(7)
    const payload = verifyAccessToken(accessToken)

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { ok: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validação básica
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { ok: false, error: 'Senha atual e nova senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { ok: false, error: 'A nova senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar senha atual
    const passwordValid = await verifyPassword(currentPassword, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { ok: false, error: 'A senha atual está incorreta' },
        { status: 401 }
      )
    }

    // Hash da nova senha
    const newPasswordHash = await hashPassword(newPassword)

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPasswordHash },
    })

    // Revogar todos os refresh tokens do usuário por segurança
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    })

    // Registrar alteração de senha na auditoria
    const clientIp = getClientIp(request)
    const userAgent = getClientUserAgent(request)

    await createAuditLog({
      action: 'PASSWORD_CHANGE',
      userId: user.id,
      ipAddress: clientIp || undefined,
      userAgent: userAgent || undefined,
      details: { email: user.email },
    })

    return NextResponse.json({
      ok: true,
      message: 'Senha alterada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
