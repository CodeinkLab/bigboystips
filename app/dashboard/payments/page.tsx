import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Settings | BigBoysTips',
  description: 'Manage your payment methods and subscription',
}

const paymentMethods = [
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Mastercard',
    last4: '8888',
    expiryDate: '08/26',
    isDefault: false,
  },
]

const transactions = [
  {
    id: 1,
    date: '2025-06-17',
    amount: 49.99,
    description: 'Monthly VIP Subscription',
    status: 'completed',
  },
  {
    id: 2,
    date: '2025-05-17',
    amount: 49.99,
    description: 'Monthly VIP Subscription',
    status: 'completed',
  },
  {
    id: 3,
    date: '2025-04-17',
    amount: 49.99,
    description: 'Monthly VIP Subscription',
    status: 'completed',
  },
]

export default function PaymentsPage() {
  return (
    <div className="p-6 lg:p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
        <p className="mt-1 text-gray-600">Manage your payment methods and view transaction history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Add new card
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.type === 'Visa' ? (
                        <svg className="h-8 w-12" viewBox="0 0 36 24" fill="none">
                          <rect width="36" height="24" rx="4" fill="#1A1F36"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M10.925 15.673H8.874L10.417 9.323H12.468L10.925 15.673ZM7.897 9.323L5.932 13.627L5.726 12.688L5.726 12.688L5.19 9.899C5.19 9.899 5.141 9.323 4.36 9.323H1.041L1 9.51C1 9.51 1.871 9.695 2.917 10.439L4.747 15.673H6.891L10.149 9.323H7.897ZM17.316 15.673H19.198L17.753 9.323H16.018C15.358 9.323 14.837 9.823 14.837 9.823L12.198 15.673H14.258L14.636 14.697H17.186L17.316 15.673ZM15.233 13.06L16.233 10.737L16.721 13.06H15.233ZM24.99 11.447L26.848 9.323H24.625L23.535 10.737L22.549 9.323H19.969L22.752 13.433L20.693 15.673H22.937L24.145 14.144L25.223 15.673H27.78L24.99 11.447Z" fill="white"/>
                        </svg>
                      ) : (
                        <svg className="h-8 w-12" viewBox="0 0 36 24" fill="none">
                          <rect width="36" height="24" rx="4" fill="#3B3B3B"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M14.739 15.239C13.892 15.895 12.866 16.223 11.663 16.223C8.641 16.223 6.223 13.927 6.223 11.061C6.223 8.195 8.641 5.9 11.663 5.9C12.866 5.9 13.892 6.228 14.739 6.884V4.567C13.892 4.075 12.866 3.747 11.663 3.747C7.322 3.747 3.8 7.044 3.8 11.112C3.8 15.18 7.322 18.477 11.663 18.477C12.866 18.477 13.892 18.149 14.739 17.657V15.239ZM22.935 12.1H17.648C17.648 13.435 18.809 14.418 20.291 14.418C21.138 14.418 21.773 14.09 22.3 13.6L22.935 15.18C22.088 15.836 21.138 16.164 19.935 16.164C17.121 16.164 15.225 14.09 15.225 11.061C15.225 8.032 17.121 5.959 19.935 5.959C22.512 5.959 24.035 7.869 24.035 10.028C24.035 10.52 23.989 11.012 23.881 11.422L22.935 12.1ZM19.935 7.705C18.651 7.705 17.753 8.688 17.648 9.999H21.984C21.931 8.77 21.165 7.705 19.935 7.705ZM31.567 16H29.144L27.144 11.176L25.197 16H22.773L19.4 6.122H21.876L23.93 11.176L25.93 6.122H28.251L30.198 11.176L32.252 6.122H34.728L31.567 16Z" fill="white"/>
                        </svg>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {method.type} ending in {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {method.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                      <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-900">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Current Plan</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">VIP Subscription</p>
                  <p className="text-xs text-gray-500">Monthly plan</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900">$49.99/mo</p>
                <p className="text-sm text-gray-500">Next billing date: July 17, 2025</p>
              </div>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Upgrade Plan
              </button>
              <button className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
