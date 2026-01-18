import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Obter access token do header Authorization
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    // Verificar token
    const payload = verifyToken(accessToken)
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Buscar usuário atualizado
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      user,
    })
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
