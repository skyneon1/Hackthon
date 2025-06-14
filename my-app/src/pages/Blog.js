import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

// Mock data
const mockCategories = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Mental Health' },
  { id: 3, name: 'Nutrition' },
  { id: 4, name: 'Fitness' },
  { id: 5, name: 'Research' }
];

const mockPosts = [
  {
    id: 1,
    title: 'The Future of Healthcare Technology',
    excerpt: 'Exploring how emerging technologies are transforming patient care and medical practices.',
    date: 'March 15, 2024',
    author: 'Dr. Sarah Johnson',
    category: 'Technology',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Mental Health in the Digital Age',
    excerpt: 'Understanding the impact of technology on mental well-being and strategies for digital wellness.',
    date: 'March 10, 2024',
    author: 'Dr. Michael Chen',
    category: 'Mental Health',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Nutrition Science: Latest Research',
    excerpt: 'A deep dive into recent studies on nutrition and their implications for everyday health.',
    date: 'March 5, 2024',
    author: 'Emily Rodriguez',
    category: 'Nutrition',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
  }
];

const BlogContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Playfair Display', serif;
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 2rem;
`;

const LeftSidebar = styled.aside`
  position: sticky;
  top: 2rem;
  height: fit-content;
  
  h3 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-weight: 700;
    position: relative;
    padding-bottom: 0.5rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: #2c3e50;
    }
  }
`;

const RightSidebar = styled.aside`
  position: sticky;
  top: 2rem;
  height: fit-content;
`;

const MainContent = styled.main`
  padding: 0 2rem;
`;

const SearchBox = styled.div`
  margin-bottom: 2rem;
  
  input {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #2c3e50;
    }
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
  
  li {
    margin-bottom: 0.8rem;
    
    a {
      color: #7f8c8d;
      text-decoration: none;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
      
      &:hover {
        color: #2c3e50;
        transform: translateX(5px);
      }
      
      span {
        background: #f8f9fa;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
        font-size: 0.8rem;
      }
    }
  }
`;

const TagsCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  .tag {
    padding: 0.4rem 0.8rem;
    background: #f8f9fa;
    color: #7f8c8d;
    border-radius: 20px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #2c3e50;
      color: white;
    }
  }
`;

const TrendingPosts = styled.div`
  margin-bottom: 2rem;
`;

const TrendingPost = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #fff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  .image {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    background: ${props => `url(${props.image}) center/cover`};
  }
  
  .content {
    flex: 1;
    
    h4 {
      font-size: 0.95rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }
    
    .meta {
      font-size: 0.8rem;
      color: #7f8c8d;
    }
  }
`;

const NewsletterBox = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 2rem;
  border-radius: 8px;
  color: white;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: white;
  }
  
  p {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-family: 'Inter', sans-serif;
    
    &:focus {
      outline: none;
    }
  }
  
  button {
    width: 100%;
    padding: 0.8rem;
    background: white;
    color: #2c3e50;
    border: none;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
  }
`;

const SocialLinks = styled.div`
  margin-top: 2rem;
  
  h3 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  .social-icons {
    display: flex;
    gap: 1rem;
    
    a {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2c3e50;
      transition: all 0.3s ease;
      
      &:hover {
        background: #2c3e50;
        color: white;
        transform: translateY(-3px);
      }
    }
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1rem;
    letter-spacing: -1px;
  }
  
  p {
    font-size: 1.2rem;
    color: #7f8c8d;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
`;

const BlogPost = styled(motion.article)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const PostImage = styled.div`
  height: 250px;
  background: ${props => `url(${props.image}) center/cover`};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
  }
`;

const PostContent = styled.div`
  padding: 2rem;
  
  .category {
    display: inline-block;
    padding: 0.4rem 1rem;
    background: #f8f9fa;
    color: #2c3e50;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 1rem;
    font-family: 'Inter', sans-serif;
  }
  
  h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    line-height: 1.3;
    font-weight: 700;
  }
  
  p {
    color: #7f8c8d;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  
  .author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    span {
      color: #2c3e50;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }
  }
  
  .date {
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .read-time {
    color: #7f8c8d;
    font-size: 0.9rem;
    font-style: italic;
  }
`;

const Blog = () => {
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  const trendingPosts = [
    {
      id: 4,
      title: 'The Science of Sleep',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop',
      date: 'March 12, 2024',
      readTime: '4 min read'
    },
    {
      id: 5,
      title: 'Digital Health Revolution',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop',
      date: 'March 8, 2024',
      readTime: '5 min read'
    }
  ];

  const tags = [
    'Health Tech', 'Wellness', 'Research', 'Nutrition', 'Fitness',
    'Mental Health', 'Prevention', 'Treatment', 'Lifestyle', 'Science'
  ];

  return (
    <BlogContainer>
      <LeftSidebar>
        <SearchBox>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        <h3>Categories</h3>
        <CategoryList>
          {mockCategories.map((category) => (
            <li key={category.id}>
              <a href="#">
                {category.name}
                <span>{Math.floor(Math.random() * 20) + 5}</span>
              </a>
            </li>
          ))}
        </CategoryList>

        <h3>Tags</h3>
        <TagsCloud>
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </TagsCloud>
      </LeftSidebar>

      <MainContent>
        <Header>
          <h1>Health & Wellness Blog</h1>
          <p>Insights, research, and expert opinions on health, wellness, and medical advancements</p>
        </Header>

        <BlogGrid>
          {mockPosts.map((post) => (
            <BlogPost
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PostImage image={post.image} />
              <PostContent>
                <span className="category">{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </PostContent>
              <PostMeta>
                <div className="author">
                  <span>{post.author}</span>
                </div>
                <div className="date">{post.date}</div>
                <div className="read-time">{post.readTime}</div>
              </PostMeta>
            </BlogPost>
          ))}
        </BlogGrid>
      </MainContent>

      <RightSidebar>
        <TrendingPosts>
          <h3>Trending Now</h3>
          {trendingPosts.map((post) => (
            <TrendingPost
              key={post.id}
              image={post.image}
              whileHover={{ y: -5 }}
            >
              <div className="image" />
              <div className="content">
                <h4>{post.title}</h4>
                <div className="meta">
                  {post.date} · {post.readTime}
                </div>
              </div>
            </TrendingPost>
          ))}
        </TrendingPosts>

        <NewsletterBox>
          <h3>Subscribe to Newsletter</h3>
          <p>Get the latest health insights and updates delivered to your inbox</p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </NewsletterBox>

        <SocialLinks>
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </SocialLinks>
      </RightSidebar>
    </BlogContainer>
  );
};

export default Blog; 