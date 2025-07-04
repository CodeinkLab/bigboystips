import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCurrentUser } from '@/app/lib/jwt';
import CreatePredictionClient from './CreatePredictionClient';

export const metadata: Metadata = {
    title: 'Create Prediction | BigBoysTips Dashboard',
    description: 'Create a new sports prediction',
  openGraph: {
    title: 'BigBoysTips - Expert Sports Predictions & Analysis',
    description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
    url: 'https://bigboystips.com',
    siteName: 'BigBoysTips',
    images: [
      {
        url: 'https://bigboystips.vercel.app/img.png',
        width: 1200,
        height: 630,
        alt: 'BigBoysTips - Expert Sports Predictions & Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigBoysTips - Expert Sports Predictions & Analysis',
    description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
    images: ['https://bigboystips.vercel.app/img.png'],
  },
  icons: {
    icon: 'https://bigboystips.vercel.app/favicon.ico',
    apple: 'https://bigboystips.vercel.app/img.png',
    other: [
      { rel: 'icon', url: 'https://bigboystips.vercel.app/img.png', sizes: '16x16' },
      { rel: 'icon', url: 'https://bigboystips.vercel.app/img.png', sizes: '32x32' },
      { rel: 'icon', url: 'https://bigboystips.vercel.app/img.png', sizes: '48x48' },
    ],
  },
  
  keywords: [
    'sports predictions',
    'expert analysis',
    'betting tips',
    'football predictions',
    'basketball predictions',
    'sports betting',
    'odds analysis',
    'winning strategies',
    'BigBoysTips'
  ],
  authors: [
    {
      name: 'Codeink Technologies',
      url: 'https://codeinktechnologies.com',
     // email: 'admin@codeinktechnologies.com'
    },
  ],
  creator: 'Codeink Technologies',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    noarchive: false,
    nosnippet: false,
  },

};

export default async function CreatePredictionPage() {
    const user = await getCurrentUser();
    const admin = user?.role === 'ADMIN';
    const session = user;

    if (!admin) {
        redirect('/');
    }
    if (!session) {
        redirect('/signin');
    }

    return (
        <div className="p-6 lg:p-4">
            <div className="flex items-center">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Prediction</h1>
                    <p className="text-gray-600 mt-1">Add a new sports prediction</p>
                </div>
                
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <CreatePredictionClient />
            </div>
        </div>
    );
}
