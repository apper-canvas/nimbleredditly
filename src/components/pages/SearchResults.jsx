import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postService } from '@/services/api/postService';
import PostFeed from '@/components/organisms/PostFeed';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const results = await postService.searchPosts(query);
        setPosts(results);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to search posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!query.trim()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <ApperIcon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No search query</h2>
          <p className="text-gray-500 mb-6">Please enter a search term to find posts.</p>
          <Button onClick={handleBackToHome} variant="outline">
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Search Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleBackToHome}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
              </h1>
              <p className="text-gray-600">
                {loading ? (
                  'Searching...'
                ) : (
                  `Found ${posts.length} result${posts.length !== 1 ? 's' : ''} for "${query}"`
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Search Query Display */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="Search" size={14} />
          <span>Search query: <strong className="text-gray-700">"{query}"</strong></span>
        </div>
      </div>

      {/* Search Results */}
      <PostFeed searchQuery={query} searchResults={posts} loading={loading} />
    </motion.div>
  );
};

export default SearchResults;