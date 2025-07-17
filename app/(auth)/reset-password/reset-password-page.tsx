'use client'

import { ResetPasswordForm } from '@/app/components/auth/ResetPasswordForm'
import { ResetPasswordWithToken } from '@/app/components/auth/ResetPasswordWithToken'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

return (
    <Suspense fallback={<div>Loading...</div>}>
        {token ? <ResetPasswordWithToken /> : <ResetPasswordForm />}
    </Suspense>
)
}
