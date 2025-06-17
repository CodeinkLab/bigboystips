import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// This would typically come from a CMS or API
const blogPosts = [
  {
    id: 1,
    slug: 'winning-betting-strategies-2025',
    title: 'Top Betting Strategies for 2025',
    content: `
      <p>In the ever-evolving world of sports betting, staying ahead of the curve is crucial. As we move through 2025, several betting strategies have emerged as particularly effective. Let's explore the most successful approaches that professional bettors are using this year.</p>

      <h2>1. Data-Driven Decision Making</h2>
      <p>The most successful bettors in 2025 are those who leverage advanced analytics and machine learning algorithms to identify value bets. This involves:</p>
      <ul>
        <li>Analyzing historical data patterns</li>
        <li>Using predictive modeling</li>
        <li>Incorporating real-time performance metrics</li>
        <li>Considering environmental factors</li>
      </ul>

      <h2>2. Bankroll Management</h2>
      <p>Proper bankroll management remains the foundation of successful betting. The key principles include:</p>
      <ul>
        <li>Never betting more than 2-5% of your total bankroll on a single bet</li>
        <li>Maintaining detailed records of all bets</li>
        <li>Setting strict loss limits</li>
        <li>Having separate accounts for betting and personal finances</li>
      </ul>

      <h2>3. Value Betting</h2>
      <p>Identifying value bets is more important than picking winners. This involves:</p>
      <ul>
        <li>Calculating true probabilities</li>
        <li>Comparing odds across multiple bookmakers</li>
        <li>Understanding market movements</li>
        <li>Being patient and selective with your bets</li>
      </ul>
    `,
    category: 'Strategy',
    author: {
      name: 'John Smith',
      avatar: '/avatars/user1.jpg',
      bio: 'Professional sports analyst with 15+ years of experience in statistical analysis and prediction modeling.',
    },
    publishedAt: '2025-06-15',
    readTime: '5 min read',
    image: '/blog/betting-strategy.jpg',
    featured: true,
    relatedPosts: [
      {
        id: 2,
        slug: 'understanding-football-odds',
        title: 'A Complete Guide to Understanding Football Odds',
        image: '/blog/football-odds.jpg',
      },
      {
        id: 3,
        slug: 'premier-league-predictions',
        title: 'Premier League 2025/26 Season Predictions',
        image: '/blog/premier-league.jpg',
      },
    ],
  },
  // Add other blog posts here...
];

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, fetch this data from an API or CMS
  const post = blogPosts.find(post => post.slug === params.slug)

  return {
    title: post ? `${post.title} | BigBoysTips Blog` : 'Blog Post Not Found',
    description: post?.content.substring(0, 160),
  }
}

export default function BlogPost({ params }: Props) {
  // In a real app, fetch this data from an API or CMS
  const post = blogPosts.find(post => post.slug === params.slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {post.category}
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <div className="mt-6 flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full"
                    width={48}
                    height={48}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{post.author.name}</p>
                    <div className="flex space-x-1 text-sm text-gray-300">
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
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Author Bio */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex items-center space-x-4">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-16 w-16 rounded-full"
                  width={64}
                  height={64}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">About {post.author.name}</h3>
                  <p className="mt-1 text-gray-600">{post.author.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Related Posts */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Related Posts</h2>
                <div className="space-y-6">
                  {post.relatedPosts.map(relatedPost => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block"
                    >
                      <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={300}
                          height={200}
                        />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
