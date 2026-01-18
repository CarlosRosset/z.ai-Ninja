import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, verifyRefreshTokenHash } from '@/lib/auth'
import { createAuditLog, getClientIp, getClientUserAgent } from '@/lib/audit'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Obter refresh token do cookie
    const refreshToken = request.cookies.get('refreshToken')?.value

    let userId: string | null = null

    if (refreshToken) {
      // Verificar token
      const payload = verifyToken(refreshToken)
      if (payload) {
        userId = payload.userId

        // Buscar e deletar refresh token
        const storedTokens = await prisma.refreshToken.findMany({
          where: { userId },
        })

        for (const stored of storedTokens) {
          const isValid = await verifyRefreshTokenHash(refreshToken, stored.token)
          if (isValid) {
            await prisma.refreshToken.delete({ where: { id: stored.id } })
            break
          }
        }
      }
    }

    // Registrar logout na auditoria
    if (userId) {
      const clientIp = getClientIp(request)
      const userAgent = getClientUserAgent(request)

      await createAuditLog({
        action: 'LOGOUT',
        userId,
        ipAddress: clientIp || undefined,
        userAgent: userAgent || undefined,
      })
    }

    // Remover cookie
    const response = NextResponse.json({ ok: true })
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
