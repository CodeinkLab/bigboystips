'use client'

import React from 'react'
import Link from 'next/link'

const Overview = () => {
  return (
     <div className="p-6 lg:p-4 w-full mx-auto">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-600 mt-1">Here&apos;s an overview of your platform&apos;s performance.</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Predictions stat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">127</h3>
          <p className="text-sm text-gray-600 mt-1">Total Predictions</p>
        </div>

        {/* Success rate stat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">+5.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">82%</h3>
          <p className="text-sm text-gray-600 mt-1">Success Rate</p>
        </div>

        {/* VIP tips stat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">NEW</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">24</h3>
          <p className="text-sm text-gray-600 mt-1">VIP Tips Available</p>
        </div>

        {/* Earnings stat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">+8.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">$1,247</h3>
          <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
        </div>
      </div>      {/* Analytics Charts */}
    

      {/* Management Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
              <Link href="/dashboard/users" className="text-sm text-blue-600 hover:text-blue-900">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { team1: 'Arsenal', team2: 'Chelsea', prediction: 'Over 2.5', result: 'won' },
              { team1: 'Barcelona', team2: 'Real Madrid', prediction: 'BTTS', result: 'pending' },
              { team1: 'Bayern', team2: 'Dortmund', prediction: '1X', result: 'lost' },
              { team1: 'PSG', team2: 'Lyon', prediction: 'Under 3.5', result: 'won' },
            ].map((game, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{game.team1} vs {game.team2}</p>
                    <p className="text-sm text-gray-600 mt-1">Prediction: {game.prediction}</p>
                  </div>
                  <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                    game.result === 'won' ? 'bg-green-50 text-green-600' :
                    game.result === 'lost' ? 'bg-red-50 text-red-600' :
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <Link href="/dashboard/predictions" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all predictions →
            </Link>
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { action: 'Added new prediction', time: '2 minutes ago', type: 'prediction' },
              { action: 'Subscription renewed', time: '1 hour ago', type: 'subscription' },
              { action: 'Updated profile', time: '3 hours ago', type: 'profile' },
              { action: 'Claimed VIP bonus', time: '5 hours ago', type: 'bonus' },
            ].map((activity, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'prediction' ? 'bg-blue-50' :
                    activity.type === 'subscription' ? 'bg-purple-50' :
                    activity.type === 'profile' ? 'bg-green-50' :
                    'bg-yellow-50'
                  }`}>
                    <svg className={`w-4 h-4 ${
                      activity.type === 'prediction' ? 'text-blue-600' :
                      activity.type === 'subscription' ? 'text-purple-600' :
                      activity.type === 'profile' ? 'text-green-600' :
                      'text-yellow-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {activity.type === 'prediction' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      )}
                      {activity.type === 'subscription' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      )}
                      {activity.type === 'profile' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      )}
                      {activity.type === 'bonus' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview