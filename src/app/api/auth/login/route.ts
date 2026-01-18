import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyPassword, generateAccessToken, generateRefreshToken, hashRefreshToken, JWTPayload } from '@/lib/auth'
import { createAuditLog, getClientIp, getClientUserAgent } from '@/lib/audit'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const passwordValid = await verifyPassword(password, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { ok: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Gerar tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    const refreshTokenHash = await hashRefreshToken(refreshToken)

    // Salvar refresh token no banco
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenHash,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    })

    // Registrar login na auditoria
    const clientIp = getClientIp(request)
    const userAgent = getClientUserAgent(request)

    await createAuditLog({
      action: 'LOGIN',
      userId: user.id,
      ipAddress: clientIp || undefined,
      userAgent: userAgent || undefined,
      details: { email: user.email },
    })

    // Criar cookie HttpOnly para refresh token
    const response = NextResponse.json({
      ok: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    })

    // Set cookie HttpOnly, Secure em produção, SameSite Lax
    const isProduction = process.env.NODE_ENV === 'production'
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      expires: refreshTokenExpiry,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
