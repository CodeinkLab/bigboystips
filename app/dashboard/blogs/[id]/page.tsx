import { Metadata } from 'next'
import BlogDetailsClient from './BlogDetailsClient'

export const metadata: Metadata = {
    title: 'Blog Details | BigBoysTips',
    description: 'Read and engage with blog content',
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <BlogDetailsClient id={id} />
        </div>
    )
}
