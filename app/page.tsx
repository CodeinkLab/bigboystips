/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import HomePageComponent from './homepagecontent/HomeComponent';
import { homeData } from './actions/utils';

export const metadata: Metadata = {
  title: 'BigBoysTips - Expert Sports Predictions & Analysis',
  description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
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

}

export default async function HomePage() {
  const homedata = await homeData()
  const res = await fetch(`https://api.ipdata.co/197.251.144.193?api-key=eca677b284b3bac29eb72f5e496aa9047f26543605efe99ff2ce35c9`, {
    method: 'GET',
    headers: {
      "Accept": "*/*",
      "contentType": "application/json",
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    referrer: "https://ipdata.co/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    mode: "cors",
    credentials: "omit"
  })

  const data = await res.json()
  console.log(data)

  return (
    <HomePageComponent content={homedata} />
  )
}
