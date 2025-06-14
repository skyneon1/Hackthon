import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

// Mock data
const mockCategories = [
  { id: 'general', name: 'General Health' },
  { id: 'mental', name: 'Mental Health' },
  { id: 'nutrition', name: 'Nutrition & Diet' },
  { id: 'fitness', name: 'Fitness & Exercise' },
  { id: 'chronic', name: 'Chronic Conditions' },
  { id: 'preventive', name: 'Preventive Care' }
];

const mockArticles = [
  {
    id: 1,
    title: 'Understanding Heart Health',
    summary: 'Learn about maintaining a healthy heart and preventing cardiovascular diseases.',
    category: 'general',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Managing Stress and Anxiety',
    summary: 'Effective strategies for managing daily stress and maintaining mental well-being.',
    category: 'mental',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Balanced Nutrition Guide',
    summary: 'Essential tips for maintaining a balanced diet and healthy eating habits.',
    category: 'nutrition',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'Home Workout Routines',
    summary: 'Simple and effective exercises you can do at home to stay fit.',
    category: 'fitness',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop'
  },
  {
    id: 5,
    title: 'Diabetes Management',
    summary: 'Comprehensive guide to managing diabetes and maintaining healthy blood sugar levels.',
    category: 'chronic',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
  },
  {
    id: 6,
    title: 'Preventive Health Screenings',
    summary: 'Important health screenings and check-ups for different age groups.',
    category: 'preventive',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop'
  }
];

const LibraryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 3rem;
    color: #1a1a1a;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  input {
    flex: 1;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #4facfe;
      box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
    }
  }
  
  button {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(79, 172, 254, 0.3);
    }
  }
`;

const Categories = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e0e0e0'};
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ArticleCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ArticleImage = styled.div`
  height: 200px;
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

const ArticleContent = styled.div`
  padding: 1.5rem;
  
  h3 {
    font-size: 1.5rem;
    color: #1a1a1a;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .category {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    background: rgba(79, 172, 254, 0.1);
    color: #4facfe;
    border-radius: 20px;
    font-size: 0.9rem;
  }
`;

const HealthLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(mockArticles);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(mockArticles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = mockArticles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
    setFilteredArticles(results);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredArticles(mockArticles);
    } else {
      const categoryArticles = mockArticles.filter(article => article.category === category);
      setFilteredArticles(categoryArticles);
    }
  };

  return (
    <LibraryContainer>
      <Header>
        <h1>Health Library</h1>
        <p>Explore our comprehensive collection of health articles and resources</p>
      </Header>

      <SearchBar>
        <input
          type="text"
          placeholder="Search health articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </SearchBar>

      <Categories>
        <CategoryButton
          active={selectedCategory === 'all'}
          onClick={() => handleCategorySelect('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Topics
        </CategoryButton>
        {mockCategories.map((category) => (
          <CategoryButton
            key={category.id}
            active={selectedCategory === category.id}
            onClick={() => handleCategorySelect(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </CategoryButton>
        ))}
      </Categories>

      <ArticlesGrid>
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage image={article.image} />
            <ArticleContent>
              <span className="category">
                {mockCategories.find(cat => cat.id === article.category)?.name}
              </span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </ArticleContent>
          </ArticleCard>
        ))}
      </ArticlesGrid>
    </LibraryContainer>
  );
};

export default HealthLibrary; 