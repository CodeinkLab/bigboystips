import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | BigBoysTips Dashboard',
  description: 'Manage your account profile and preferences',
}

export default function ProfilePage() {
  return (
    <div className="p-6 lg:p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
              <p className="text-sm text-gray-600 mt-1">Update your account information</p>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
              <p className="text-sm text-gray-600 mt-1">Your current plan</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">VIP Plan</p>
                    <p className="text-xs text-gray-600">Monthly subscription</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                    Active
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Next billing date</dt>
                      <dd className="text-sm font-medium text-gray-900">July 16, 2025</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Amount</dt>
                      <dd className="text-sm font-medium text-gray-900">$29.99/month</dd>
                    </div>
                  </dl>
                </div>
                <div className="pt-4">
                  <button className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your notification preferences</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { label: 'New predictions', description: 'Get notified when new predictions are available' },
                  { label: 'Results', description: 'Get notified about your prediction results' },
                  { label: 'Subscription', description: 'Receive billing and subscription updates' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        defaultChecked={i !== 2}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-700">{item.label}</label>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
