import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthResult {
  user: {
    id: string
    email: string
    role: number
  }
  userId: string
}

/**
 * Verifica autenticação a partir do access token
 * @throws {Error} Se não autenticado
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')
  const accessToken = authHeader?.replace('Bearer ', '')

  if (!accessToken) {
    throw new Error('Não autenticado')
  }

  const payload = verifyToken(accessToken)
  if (!payload) {
    throw new Error('Token inválido')
  }

  return {
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    userId: payload.userId,
  }
}

/**
 * Verifica autorização por papel mínimo
 * @throws {Error} Se não autorizado
 */
export function requireRole(userRole: number, minRole: number): void {
  if (userRole < minRole) {
    throw new Error('Acesso negado')
  }
}

/**
 * Obtém userId do token sem lançar erro (retorna null se não autenticado)
 */
export async function getOptionalUserId(request: NextRequest): Promise<string | null> {
  try {
    const auth = await requireAuth(request)
    return auth.userId
  } catch {
    return null
  }
}
