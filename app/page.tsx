/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import HomePageComponent from './homepagecontent/HomeComponent';
import { homeData } from './actions/utils';

export const metadata: Metadata = {
  title: 'BigBoysTips - Expert Sports Predictions & Analysis',
  description: 'Get accurate sports predictions and expert analysis. Join our community of successful bettors.',
}

export default async function HomePage() {
  const homedata = await homeData()  

  return (
    <HomePageComponent content={homedata} />
  )
}
