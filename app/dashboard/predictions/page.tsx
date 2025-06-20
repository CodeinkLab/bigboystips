import { getData } from '@/app/lib/database'
import { Metadata } from 'next'
import Link from 'next/link'
import GetPredictions from './GetPredictions';

export const metadata: Metadata = {
  title: 'Predictions | BigBoysTips Dashboard',
  description: 'View and manage your sports predictions',
}

export default async function PredictionsPage() {
  return (
 <GetPredictions/>
  )
}
