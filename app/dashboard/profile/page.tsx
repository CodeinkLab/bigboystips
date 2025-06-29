import { Metadata } from 'next'
import ProfileClient from './ProfileClient'
import { getCurrentUser } from '@/app/lib/jwt'

export const metadata: Metadata = {
  title: 'Profile | BigBoysTips Dashboard',
  description: 'Manage your account profile and preferences',
}

export default async function ProfilePage() {

  const user = await getCurrentUser()

  return (

    <div className="p-6 lg:p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>
      <ProfileClient id={user!.id} />
    </div>
  )

}
