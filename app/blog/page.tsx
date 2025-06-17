import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | BigBoysTips',
  description: 'Latest betting tips, analysis, and sports predictions insights',
}

// Sample blog data - In a real app, this would come from a CMS or API
const blogPosts = [
  {
    id: 1,
    slug: 'winning-betting-strategies-2025',
    title: 'Top Betting Strategies for 2025',
    excerpt: 'Learn the most effective betting strategies that are working in 2025. From statistical analysis to bankroll management.',
    category: 'Strategy',
    author: {
      name: 'John Smith',
      avatar: '/avatars/user1.jpg',
    },
    publishedAt: '2025-06-15',
    readTime: '5 min read',
    image: '/blog/betting-strategy.jpg',
    featured: true,
  },
  {
    id: 2,
    slug: 'understanding-football-odds',
    title: 'A Complete Guide to Understanding Football Odds',
    excerpt: 'Master the fundamentals of football betting odds. Learn how bookmakers set odds and how to identify value bets.',
    category: 'Education',
    author: {
      name: 'Maria Rodriguez',
      avatar: '/avatars/user2.jpg',
    },
    publishedAt: '2025-06-14',
    readTime: '8 min read',
    image: '/blog/football-odds.jpg',
  },
  {
    id: 3,
    slug: 'premier-league-predictions',
    title: 'Premier League 2025/26 Season Predictions',
    excerpt: 'Expert analysis and predictions for the upcoming Premier League season. Team analysis, transfer impact, and more.',
    category: 'Analysis',
    author: {
      name: 'David Chen',
      avatar: '/avatars/user3.jpg',
    },
    publishedAt: '2025-06-13',
    readTime: '10 min read',
    image: '/blog/premier-league.jpg',
  },
];

export default function BlogPage() {
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
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Latest Insights & Analysis
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mt-16">
              Expert betting analysis, tips, and strategies to improve your predictions
            </p>
          </div>
        </div>
     

      {/* Featured Post */}
      {blogPosts.filter(post => post.featured).map(post => (
        <div key={post.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
                width={1200}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
            </div>
            <div className="relative py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
              <div className="flex flex-col items-center text-center">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {post.title}
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Read More
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.filter(post => !post.featured).map(post => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  width={400}
                  height={200}
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-8 w-8 rounded-full"
                      width={32}
                      height={32}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
