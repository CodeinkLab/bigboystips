'use client'

import { EmailVerificationForm } from '@/app/components/auth/EmailVerificationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email | BigBoysTips',
  description: 'Verify your email address',
}

export default function VerifyEmailPage() {
  return <EmailVerificationForm/>
}
