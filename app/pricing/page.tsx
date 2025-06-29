import { Metadata } from 'next'
import PricingComponent from './pricingcomponent'

export const metadata: Metadata = {
  title: 'Pricing Plans | BigBoysTips',
  description: 'Choose your subscription plan and access premium predictions',
}

const paymentKeys: Record<string, string> = {
  FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY || '',
  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY || '',
  FLW_ENCRYPTION_KEY: process.env.FLW_ENCRYPTION_KEY || '',
  FLW_BASE_URL: process.env.FLW_BASE_URL || '',
  FLW_SUBACCOUNT_ID: process.env.FLW_SUBACCOUNT_ID || '',
}

export default function PricingPage() {
  return (
    <PricingComponent paymentKeys={paymentKeys} />
  )
}
