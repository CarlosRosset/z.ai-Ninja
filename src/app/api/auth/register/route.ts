import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword, generateAccessToken, generateRefreshToken, hashRefreshToken, JWTPayload } from '@/lib/auth'
import { createAuditLog, getClientIp, getClientUserAgent } from '@/lib/audit'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schema de validação
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  avatar: z.string().url().optional(),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação
    const validatedData = registerSchema.parse(body)

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hashPassword(validatedData.password)

    // Criar usuário (papel padrão: USER)
    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        name: validatedData.name,
        password: hashedPassword,
        role: UserRole.USER, // Por padrão, novos usuários são USER
        avatar: validatedData.avatar,
        phone: validatedData.phone,
      },
    })

    // Gerar tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    const refreshTokenHash = await hashRefreshToken(refreshToken)

    // Salvar refresh token
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenHash,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    })

    // Registrar registro na auditoria
    const clientIp = getClientIp(request)
    const userAgent = getClientUserAgent(request)

    await createAuditLog({
      action: 'REGISTER',
      userId: user.id,
      ipAddress: clientIp || undefined,
      userAgent: userAgent || undefined,
      details: { email: user.email, role: user.role },
    })

    // Criar cookie
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

    const isProduction = process.env.NODE_ENV === 'production'
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      expires: refreshTokenExpiry,
      path: '/',
    })

    return response
  } catch (error) {
    // Erro de validação do Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro no registro:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
