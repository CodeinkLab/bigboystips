import { Metadata } from 'next'

const pricingPlans = [
  {
    id: 'daily',
    name: 'Daily Pass',
    price: 50,
    currency: 'GHS',
    interval: 'day',
    features: [
      'Daily premium predictions',
      'Expert analysis',
      '24/7 Support'
    ],
    isPopular: false,
  },
  {
    id: 'weekly',
    name: 'Weekly Pass',
    price: 300,
    currency: 'GHS',
    interval: 'week',
    features: [
      'All daily pass features',
      'Weekly special picks',
      'Basic analysis tools'
    ],
    isPopular: false,
  },
  {
    id: 'monthly',
    name: 'Monthly Pass',
    price: 1500,
    currency: 'GHS',
    interval: 'month',
    features: [
      'All daily pass features',
      'Historical data access',
      'Priority support'
    ],
    isPopular: true,
  },
  {
    id: 'annual',
    name: 'Annual Pass',
    price: 18250,
    currency: 'GHS',
    interval: 'year',
    features: [
      'All monthly pass features',
      'Exclusive VIP predictions',
      'Personal betting consultant'
    ],
    isPopular: false,
  }
]

export const metadata: Metadata = {
  title: 'Pricing Plans | BigBoysTips',
  description: 'Choose your subscription plan and access premium predictions',
}

export default function PricingPage() {
  return (
    <div className="relative mx-auto px-4 py-12">
      <div className="absolute inset-0 bg-cover bg-center h-64 shadow-lg -z-20"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(143, 143, 143, 0.753), rgba(77, 77, 77, 0.795)), url(/stadium.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>

      </div>
      <div className="max-w-4xl mx-auto mt-28 z-50">
        <h1 className="text-4xl font-bold mb-20 text-white">Choose Your Plan</h1>
        <p className="text-2xl text-gray-600 text-center mt-32">Get access to premium predictions and expert analysis</p>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto my-16">
        {pricingPlans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative bg-neutral-100 rounded-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ${
              plan.isPopular ? 'border-2 border-blue-600' : 'border border-neutral-200 shadow-md'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg">
                Popular
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h2>
            <p className="text-4xl font-bold text-blue-600 mb-6">
              <span className="text-base text-neutral-500">{plan.currency}</span>{plan.price.toLocaleString()}<span className="text-lg font-normal text-gray-500">/{plan.interval}</span>
            </p>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
