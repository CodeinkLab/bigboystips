import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prediction Details | BigBoysTips',
  description: 'View detailed prediction analysis and tips',
}

export default function PredictionDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Prediction Details</h1>
        {/* Add prediction details content here */}
      </div>
    </div>
  )
}
