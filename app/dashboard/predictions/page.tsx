import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Predictions | BigBoysTips Dashboard',
  description: 'View and manage your sports predictions',
}

export default function PredictionsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Predictions</h1>
        <p className="text-gray-600 mt-1">View and track all your predictions</p>
      </div>

      {/* Predictions filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>All Sports</option>
          <option>Football</option>
          <option>Basketball</option>
          <option>Tennis</option>
        </select>
        <select className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>All Status</option>
          <option>Won</option>
          <option>Lost</option>
          <option>Pending</option>
        </select>
        <select className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>All time</option>
        </select>
      </div>

      {/* Predictions list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  date: '2025-06-16',
                  match: 'Arsenal vs Chelsea',
                  prediction: 'Over 2.5',
                  odds: '1.95',
                  status: 'won'
                },
                {
                  date: '2025-06-16',
                  match: 'Barcelona vs Real Madrid',
                  prediction: 'BTTS',
                  odds: '1.80',
                  status: 'pending'
                },
                {
                  date: '2025-06-15',
                  match: 'Bayern vs Dortmund',
                  prediction: '1X',
                  odds: '1.65',
                  status: 'lost'
                },
                {
                  date: '2025-06-15',
                  match: 'PSG vs Lyon',
                  prediction: 'Under 3.5',
                  odds: '1.75',
                  status: 'won'
                },
              ].map((prediction, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prediction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prediction.match}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prediction.prediction}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prediction.odds}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prediction.status === 'won' ? 'bg-green-50 text-green-600' :
                      prediction.status === 'lost' ? 'bg-red-50 text-red-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                      {prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50" disabled>
            Previous
          </button>
          <span className="text-sm text-gray-600">Page 1 of 10</span>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
