import { Metadata } from 'next'
import BlogsClient from './BlogsClient'

export const metadata: Metadata = {
  title: 'Blog Management | BigBoysTips',
  description: 'Manage blog posts and content',
}

export default function BlogsPage() {
  return (
    <div className="p-4 lg:p-4">
      <BlogsClient />
    </div>
  )
}
