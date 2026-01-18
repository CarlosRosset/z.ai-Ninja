import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth, requireRole } from '@/lib/auth-middleware'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schema de validação
const createFavoriteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  link: z.string().url('Link inválido'),
  description: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
})

/**
 * GET /api/favorites
 * Lista favorites do usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, user } = await requireAuth(request)

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      ok: true,
      favorites,
    })
  } catch (error) {
    const errorMessage = (error as Error).message

    if (errorMessage === 'Não autenticado' || errorMessage === 'Token inválido') {
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 401 }
      )
    }

    console.error('Erro ao listar favorites:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/favorites
 * Cria um novo favorite para o usuário autenticado
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, user } = await requireAuth(request)
    const body = await request.json()

    // Validação
    const validatedData = createFavoriteSchema.parse(body)

    // Criar favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        title: validatedData.title,
        link: validatedData.link,
        description: validatedData.description || '',
        image: validatedData.image,
        category: validatedData.category,
      },
    })

    // Audit log
    await createAuditLog({
      action: 'CREATE_FAVORITE',
      userId,
      details: { favoriteId: favorite.id, title: favorite.title },
    })

    return NextResponse.json({
      ok: true,
      favorite,
    }, { status: 201 })
  } catch (error) {
    const errorMessage = (error as Error).message

    // Erro de autenticação
    if (errorMessage === 'Não autenticado' || errorMessage === 'Token inválido') {
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 401 }
      )
    }

    // Erro de validação do Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro ao criar favorite:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
