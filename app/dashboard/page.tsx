
import { Metadata } from 'next'
import Overview from './components/overview'
import Dashboard from './components/overview'

export const metadata: Metadata = {
  title: 'Dashboard | BigBoysTips',
  description: 'Manage your predictions, users, and content',
}

export default function DashboardPage() {  return (
   <Dashboard/>
  )
}
