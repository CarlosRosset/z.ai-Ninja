import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '@/lib/auth-middleware'
import { createAuditLog } from '@/lib/audit'

const prisma = new PrismaClient()

/**
 * DELETE /api/favorites/:id
 * Deleta um favorite do usuário autenticado
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth(request)
    const { id } = await params

    // Verificar se o favorite existe e pertence ao usuário
    const favorite = await prisma.favorite.findUnique({
      where: { id },
    })

    if (!favorite) {
      return NextResponse.json(
        { ok: false, error: 'Favorite não encontrado' },
        { status: 404 }
      )
    }

    if (favorite.userId !== userId) {
      return NextResponse.json(
        { ok: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Deletar favorite
    await prisma.favorite.delete({
      where: { id },
    })

    // Audit log
    await createAuditLog({
      action: 'DELETE_FAVORITE',
      userId,
      details: { favoriteId: id, title: favorite.title },
    })

    return NextResponse.json({
      ok: true,
      message: 'Favorite removido com sucesso',
    })
  } catch (error) {
    const errorMessage = (error as Error).message

    if (errorMessage === 'Não autenticado' || errorMessage === 'Token inválido') {
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 401 }
      )
    }

    console.error('Erro ao deletar favorite:', error)
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
