import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Blog Management | BigBoysTips',
  description: 'Manage blog posts and content',
}

const posts = [
  {
    id: 1,
    title: 'Top Betting Strategies for 2025',
    excerpt: 'Learn the most effective betting strategies that professional bettors are using in 2025...',
    status: 'Published',
    category: 'Strategy',
    author: {
      name: 'John Smith',
      avatar: '/avatars/user1.jpg',
    },
    publishedAt: '2025-06-15',
    readTime: '5 min',
    image: '/blog/betting-strategy.jpg',
  },
  // Add more mock posts as needed
]

export default function BlogsPage() {
  return (
    <div className="p-6 lg:p-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your blog posts, create new content, and monitor engagement.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            New post
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="flex-shrink-0">
              <Image
                className="h-48 w-full object-cover"
                src={post.image}
                alt={post.title}
                width={400}
                height={200}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 block">
                  <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                  <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                </div>
                <div className="mt-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                  <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Edit post</button>
                <button className="ml-6 text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
