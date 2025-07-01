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
    const { email, password, username } = await request.json()

    const location = await getLocationData()

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
    const emailVerificationToken = await generateToken({ email }, '24h')

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
    //await sendVerificationEmail(email, emailVerificationToken)

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
    return NextResponse.json(
      { error: 'An error occurred during signup ' + error.message },
      { status: 500 }
    )
  }
}

