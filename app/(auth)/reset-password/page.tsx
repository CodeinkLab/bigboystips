import { Metadata } from 'next'
import { ResetPasswordForm } from '@/app/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | BigBoysTips',
  description: 'Reset your account password',
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
