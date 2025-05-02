import React from 'react'
import { Link } from 'react-router-dom'
import './Blog.css'
import Background from '../Background/Background'
import Header from '../Header/Header'

// Import all blog posts
import PostOne from './BlogPosts/PostOne'
import PostTwo from './BlogPosts/PostTwo'
import PostThree from './BlogPosts/PostThree'
import PostFour from './BlogPosts/PostFour'
import PostFive from './BlogPosts/PostFive'
import PostSix from './BlogPosts/PostSix'
import PostSeven from './BlogPosts/PostSeven'
import PostEight from './BlogPosts/PostEight'

export default function Blog() {
    const blogPosts = [
        {
            id: 'post1',
            title: 'The History of Tambola',
            excerpt: 'Explore the fascinating origins of Tambola and how it evolved over centuries to become the beloved game we know today.',
            date: 'May 1, 2025',
            author: 'Ajey Nagarkatti',
            imageUrl: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?q=80&w=1000',
            component: PostOne
        },
        {
            id: 'post2',
            title: 'Tambola Strategies: Increase Your Chances of Winning',
            excerpt: 'While Tambola is primarily a game of chance, there are strategies that can help you maximize your winning potential.',
            date: 'April 25, 2025',
            author: 'Radhika Priyavardhini',
            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000',
            component: PostTwo
        },
        {
            id: 'post3',
            title: 'Hosting a Virtual Tambola Party: Tips and Tricks',
            excerpt: 'Learn how to host an engaging and fun virtual Tambola party for friends and family using our online platform.',
            date: 'April 18, 2025',
            author: 'Ajey Nagarkatti',
            imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000',
            component: PostThree
        },
        {
            id: 'post4',
            title: 'Tambola Around the World: Different Versions and Rules',
            excerpt: 'Discover how Tambola (also known as Housie or Bingo) is played in different countries with unique variations and rules.',
            date: 'April 10, 2025',
            author: 'Radhika Priyavardhini',
            imageUrl: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1000',
            component: PostFour
        },
        {
            id: 'post5',
            title: 'The Psychology of Tambola: Why We Love the Game',
            excerpt: 'Explore the psychological aspects that make Tambola such an engaging and addictive game for people of all ages.',
            date: 'April 3, 2025',
            author: 'Ajey Nagarkatti',
            imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000',
            component: PostFive
        },
        {
            id: 'post6',
            title: 'Tambola for Fundraising: How to Organize Charity Events',
            excerpt: 'Learn how to use Tambola as an effective and fun way to raise funds for charitable causes and community projects.',
            date: 'March 27, 2025',
            author: 'Radhika Priyavardhini',
            imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd59a93f9724?q=80&w=1000',
            component: PostSix
        },
        {
            id: 'post7',
            title: 'Digital vs. Traditional Tambola: Pros and Cons',
            excerpt: 'Compare the experience of playing Tambola online versus the traditional paper-based version with physical tokens.',
            date: 'March 20, 2025',
            author: 'Ajey Nagarkatti',
            imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1000',
            component: PostSeven
        },
        {
            id: 'post8',
            title: 'Tambola Calling: The Art of Being a Great Caller',
            excerpt: 'Tips and techniques for becoming an entertaining and engaging Tambola caller that players will love.',
            date: 'March 13, 2025',
            author: 'Radhika Priyavardhini',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000',
            component: PostEight
        }
    ];

    return (
        <div>
            <Background />
            <Header />
            <div className="blog-container">
                <h1>Tambola Blog</h1>
                <p className="blog-intro">
                    Welcome to our blog where we share insights, tips, and stories about the wonderful world of Tambola. 
                    Explore our articles to enhance your gaming experience!
                </p>
                
                <div className="blog-posts-grid">
                    {blogPosts.map(post => (
                        <div className="blog-post-card" key={post.id}>
                            <div className="blog-post-image">
                                <img src={post.imageUrl} alt={post.title} />
                            </div>
                            <div className="blog-post-content">
                                <h2>{post.title}</h2>
                                <p className="blog-post-meta">
                                    <span className="blog-post-date">{post.date}</span> | 
                                    <span className="blog-post-author"> By {post.author}</span>
                                </p>
                                <p className="blog-post-excerpt">{post.excerpt}</p>
                                <Link to={`/blog/${post.id}`} className="read-more-link">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
