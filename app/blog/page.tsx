import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BlogsClient from './BlogsClient'

export const metadata: Metadata = {
  title: 'Blog | BigBoysTips',
  description: 'Latest betting tips, analysis, and sports predictions insights',
}

// Sample blog data - In a real app, this would come from a CMS or API

export default function BlogPage() {
  return (
    <BlogsClient />
  )
}
