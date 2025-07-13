import React from 'react'
import { useParams, Link } from 'react-router-dom'
import './BlogPost.css'
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

export default function BlogPost() {
    const { postId } = useParams()
    
    const blogPosts = {
        'post1': {
            title: 'The History of Tambola',
            date: 'May 1, 2025',
            author: 'Ajey Nagarkatti',
            component: PostOne
        },
        'post2': {
            title: 'Tambola Strategies: Increase Your Chances of Winning',
            date: 'April 25, 2025',
            author: 'Radhika Priyavardhini',
            component: PostTwo
        },
        'post3': {
            title: 'Hosting a Virtual Tambola Party: Tips and Tricks',
            date: 'April 18, 2025',
            author: 'Ajey Nagarkatti',
            component: PostThree
        },
        'post4': {
            title: 'Tambola Around the World: Different Versions and Rules',
            date: 'April 10, 2025',
            author: 'Radhika Priyavardhini',
            component: PostFour
        },
        'post5': {
            title: 'The Psychology of Tambola: Why We Love the Game',
            date: 'April 3, 2025',
            author: 'Ajey Nagarkatti',
            component: PostFive
        },
        'post6': {
            title: 'Tambola for Fundraising: How to Organize Charity Events',
            date: 'March 27, 2025',
            author: 'Radhika Priyavardhini',
            component: PostSix
        },
        'post7': {
            title: 'Digital vs. Traditional Tambola: Pros and Cons',
            date: 'March 20, 2025',
            author: 'Ajey Nagarkatti',
            component: PostSeven
        },
        'post8': {
            title: 'Tambola Calling: The Art of Being a Great Caller',
            date: 'March 13, 2025',
            author: 'Radhika Priyavardhini',
            component: PostEight
        }
    }
    
    const post = blogPosts[postId]
    const PostComponent = post ? post.component : null

    if (!post) {
        return (
            <div>
                <Background />
                <Header />
                <div className="blog-post-container">
                    <h1>Post Not Found</h1>
                    <p>Sorry, the blog post you're looking for doesn't exist.</p>
                    <Link to="/blog" className="back-to-blog">Back to Blog</Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Background />
            <Header />
            <div className="blog-post-container">
                <div className="blog-post-header">
                    <h1>{post.title}</h1>
                    <div className="blog-post-meta">
                        <span className="blog-post-date">{post.date}</span> | 
                        <span className="blog-post-author"> By {post.author}</span>
                    </div>
                </div>
                
                <div className="blog-post-content">
                    <PostComponent />
                </div>
                
                <div className="blog-post-navigation">
                    <Link to="/blog" className="back-to-blog">Back to Blog</Link>
                </div>
            </div>
        </div>
    )
}
