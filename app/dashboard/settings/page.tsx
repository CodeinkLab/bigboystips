import { Metadata } from 'next'

import { getCurrentUser } from '@/app/lib/jwt'
import Settingscomponent from './settingscomponent'
import { redirect } from 'next/navigation'
import { useContent } from '@/app/contexts/ContentContext'

export const metadata: Metadata = {
  title: 'Settings | BigBoysTips Dashboard',
  description: 'Manage your account settings and preferences',
}

export default async function SettingsPage() {

  const user = await getCurrentUser()
  if (!user) { return redirect('/') }
 
  const currency = String(user?.location.currency || 'GHS')

  return (

    <div className="p-6 lg:p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>
      <Settingscomponent currency={currency} />
    </div>
  )

}
