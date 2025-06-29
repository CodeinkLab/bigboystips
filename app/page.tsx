/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import HomePageComponent from './homepagecontent/HomeComponent';

// Add custom Stats card for animation
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center sm:text-left transition-all duration-300 hover:scale-105">
    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
      {value}
    </p>
    <p className="text-xs sm:text-sm text-gray-200">{label}</p>
  </div>
)

export const metadata: Metadata = {
  title: 'BigBoysTips - Expert Sports Predictions & Analysis',
  description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
}

export default function HomePage() {
  return (
    <HomePageComponent />

  )
}
