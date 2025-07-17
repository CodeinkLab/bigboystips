'use client'

import { ResetPasswordForm } from '@/app/components/auth/ResetPasswordForm'
import { ResetPasswordWithToken } from '@/app/components/auth/ResetPasswordWithToken'
import { useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  return token ? <ResetPasswordWithToken /> : <ResetPasswordForm />
}
