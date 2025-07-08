/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/app/lib/prisma'
import { signJWT, setAuthCookie } from '@/app/lib/jwt'
import { sendVerificationEmail } from '@/app/lib/email'
import { generateToken } from '@/app/lib/auth'
import { getLocationData } from '@/app/lib/location'

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] || '8.8.8.8'

    console.log('Client\'s ip address: ', ip)

    const { email, password, username } = await request.json()

    const location = await getLocationData(ip)
    console.log(location)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered, choose another one.' },
        { status: 400 }
      )
    }


    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate email verification token
    const emailVerificationToken = await generateToken({ email }, '5h')



    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username,
        emailVerified: false,
        location
      },
    })

    // Send verification email
    await fetch('/api/resend-verification', {
      method: "POST",
      headers: {
        "Content-Type": "appliction/json"
      },
      body: JSON.stringify({ email })
    })

    // Create JWT token
    const token = await signJWT({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      emailVerified: user.emailVerified,
      location: user.location,
    })

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        emailVerified: user.emailVerified,
        location: user.location,

      },
      message: 'Verification email sent. Please check your inbox.',
    },
      { status: 201 }
    )

    // Set auth cookie
    setAuthCookie(response, token)

    return response
  } catch (error: any) {
    console.error('Signup error:', error.message)
    throw new Error(error.message || 'Failed to sign up')
  } finally {
    await prisma.$disconnect();
  }
}

