import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getClientIp, getClientUserAgent } from '@/lib/audit'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Simular envio de email de recuperação
    // Em produção, aqui seria integrado com serviço de email real
    // TODO: Integrar com serviço de email real (SendGrid, AWS SES, etc.)

    return NextResponse.json({
      ok: true,
      message: 'Instruções de recuperação enviadas com sucesso',
    })
  } catch (error) {
    console.error('Erro no envio de email de recuperação:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
