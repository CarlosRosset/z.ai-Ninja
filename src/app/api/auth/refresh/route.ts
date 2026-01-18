import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, generateAccessToken, verifyRefreshTokenHash } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Obter refresh token do cookie
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { ok: false, error: 'Refresh token não encontrado' },
        { status: 401 }
      )
    }

    // Verificar token
    const payload = verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Refresh token inválido' },
        { status: 401 }
      )
    }

    // Buscar refresh token no banco
    const storedTokens = await prisma.refreshToken.findMany({
      where: {
        userId: payload.userId,
      },
    })

    // Verificar qual hash corresponde ao token
    let matchedTokenId: string | null = null

    for (const stored of storedTokens) {
      const isValid = await verifyRefreshTokenHash(refreshToken, stored.token)
      if (isValid) {
        matchedTokenId = stored.id
        break
      }
    }

    if (!matchedTokenId) {
      return NextResponse.json(
        { ok: false, error: 'Refresh token inválido' },
        { status: 401 }
      )
    }

    // Verificar expiração
    const storedToken = storedTokens.find(t => t.id === matchedTokenId)
    if (!storedToken || storedToken.expiresAt < new Date()) {
      // Remover token expirado
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } })
      }
      return NextResponse.json(
        { ok: false, error: 'Refresh token expirado' },
        { status: 401 }
      )
    }

    // Gerar novo access token
    const newAccessToken = generateAccessToken(payload)

    return NextResponse.json({
      ok: true,
      accessToken: newAccessToken,
    })
  } catch (error) {
    console.error('Erro no refresh:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
