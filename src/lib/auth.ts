import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Configurações JWT
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_ACCESS_EXPIRY = '15m' // 15 minutos
const JWT_REFRESH_EXPIRY = '30d' // 30 dias

export interface JWTPayload {
  userId: string
  email: string
  role: number
}

/**
 * Gera um access token JWT
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  })
}

/**
 * Gera um refresh token JWT
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  })
}

/**
 * Verifica e decodifica um JWT
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Hash de senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verifica senha usando bcrypt
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Hash de refresh token para armazenar no banco
 */
export async function hashRefreshToken(token: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(token, saltRounds)
}

/**
 * Verifica refresh token hash
 */
export async function verifyRefreshTokenHash(
  token: string,
  hashedToken: string
): Promise<boolean> {
  return bcrypt.compare(token, hashedToken)
}
