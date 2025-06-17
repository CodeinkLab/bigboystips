import { Metadata } from 'next'
import { SigninForm } from '@/app/_components/auth/SigninForm'

export const metadata: Metadata = {
  title: 'Sign In | BigBoysTips',
  description: 'Sign in to your BigBoysTips account',
}
export default function SignInPage() {
  return <SigninForm />
}

