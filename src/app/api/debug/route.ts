import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const diagnostic = {
    timestamp: new Date().toISOString(),
    host: request.headers.get('host'),
    forwardedHost: request.headers.get('x-forwarded-host'),
    forwardedFor: request.headers.get('x-forwarded-for'),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      databaseUrlMasked: process.env.DATABASE_URL?.replace(/\/db\/.*/, '/db/***') || 'NOT_SET',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
    database: {
      status: 'checking...',
      users: [],
    },
  }

  try {
    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      take: 5,
    })

    diagnostic.database = {
      status: 'connected',
      userCount,
      users: users,
    }
  } catch (error) {
    diagnostic.database = {
      status: 'error',
      error: (error as Error).message,
    }
  }

  return NextResponse.json(diagnostic)
}
