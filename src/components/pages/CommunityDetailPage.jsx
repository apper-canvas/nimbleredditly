import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { communityService } from "@/services/api/communityService";
import PostFeed from "@/components/organisms/PostFeed";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatDistanceToNow } from "date-fns";

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    loadCommunity();
  }, [id]);

  const loadCommunity = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await communityService.getById(id);
      setCommunity(data);
    } catch (err) {
      setError(err.message || "Community not found");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  if (loading) {
    return <Loading type="default" />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCommunity} />;
  }

  if (!community) {
    return <ErrorView message="Community not found" />;
  }

  const createdDate = formatDistanceToNow(new Date(community.createdAt), { addSuffix: true });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Community Header */}
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: community.color }}
            >
              {community.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">r/{community.name}</h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                {community.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                  Created {createdDate}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="MessageSquare" className="w-4 h-4 mr-1" />
                  {community.postCount} posts
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                  1.2k members
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="md"
            >
              <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
              Join Community
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePost}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Back Navigation */}
      <motion.button
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        <span>Back</span>
      </motion.button>

      {/* Posts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
        <PostFeed communityId={id} onCreatePost={handleCreatePost} />
      </motion.div>

      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </motion.div>
  );
};

export default CommunityDetailPage;