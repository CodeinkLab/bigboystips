import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-16">
            {/* About */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">About BigBoysTips</h4>
              <p className="text-gray-400 text-sm">
                Expert sports predictions and analysis platform helping bettors make informed decisions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors text-sm">Home</Link></li>
                <li><Link href="/predictions" className="hover:text-white transition-colors text-sm">Predictions</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors text-sm">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact Info</h4>
              <div className="space-y-2">
                <p className='text-sm'>Call/WhatsApp: +233 54 281 0847</p>
                <p className='text-sm'>Email: senanick1333@gmail.com</p>
                <p className='text-sm'>Telegram: @NICKSENA1</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://t.me/bigboyzg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                  </svg>
                </a>
                <a href="https://twitter.com/SenaNick1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} BigBoysTips. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer