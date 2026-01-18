import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuditLogOptions {
  action: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'CREATE_FAVORITE' | 'UPDATE_FAVORITE' | 'DELETE_FAVORITE' | 'PASSWORD_CHANGE'
  userId?: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, any>
}

/**
 * Registra um log de auditoria
 */
export async function createAuditLog(options: AuditLogOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        action: options.action,
        userId: options.userId,
        ipAddress: options.ipAddress || null,
        userAgent: options.userAgent || null,
        details: options.details ? JSON.stringify(options.details) : null,
      },
    })
  } catch (error) {
    console.error('Erro ao criar audit log:', error)
  }
}

/**
 * Obtém IP da requisição
 */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return null
}

/**
 * Obtém User-Agent da requisição
 */
export function getClientUserAgent(request: Request): string | null {
  return request.headers.get('user-agent') || null
}
