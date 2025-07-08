/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { verifyToken } from '@/app/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the token
    const decoded = verifyToken(token) as any

    if (!decoded || decoded.email !== email) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    })

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect();
  }
}
