import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | BigBoysTips',
  description: 'Get in touch with BigBoysTips team',
}

export default function ContactPage() {
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
        <h1 className="text-4xl font-bold mb-20 text-white">Contact Us</h1>
        <div className="bg-white rounded-lg p-8 backdrop-blur-sm bg-opacity-90 mt-28">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Direct Contact Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Direct Contact
              </h3>
              <div className="space-y-4">
                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+233542810847" target='_blank' className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                      +233 542 810 847
                    </a>
                  </p>
                </div>

                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    <a href="https://wa.me/233542810847" target='_blank' className="text-gray-600 hover:text-green-600 transition-colors duration-300">
                      WhatsApp
                    </a>
                  </p>
                </div>

                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:senanick1333@gmail.com" target='_blank' className="text-gray-600 hover:text-red-600 transition-colors duration-300">
                      senanick1333@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Social Media
              </h3>
              <div className="space-y-4">
                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-start space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.039 18.845c-.943.02-1.875-.177-2.746-.574l-3.85 1.004 1.027-3.744c-.445-.92-.664-1.934-.664-2.979 0-3.794 3.085-6.87 6.878-6.87 3.794 0 6.878 3.076 6.878 6.87 0 3.793-3.084 6.87-6.878 6.87z" />
                    </svg>
                    <div className="flex flex-col space-y-2">
                      <a href="https://t.me/bigboyzg" target='_blank' className="text-gray-600 hover:text-blue-500 transition-colors duration-300">Channel</a>
                      <a href="https://t.me/NICKSENA1" target='_blank' className="text-gray-600 hover:text-blue-500 transition-colors duration-300">@NICKSENA1</a>
                      <a href="https://t.me/+S5cnced294syODc1" target='_blank' className="text-gray-600 hover:text-blue-500 transition-colors duration-300">Group Link</a>
                    </div>
                  </p>
                </div>

                <div className="group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <p className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <a href="https://twitter.com/SenaNick1" target='_blank' className="text-gray-600 hover:text-blue-400 transition-colors duration-300">
                      @SenaNick1
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}
