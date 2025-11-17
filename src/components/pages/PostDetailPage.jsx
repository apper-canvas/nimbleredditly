import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { postService } from "@/services/api/postService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CommunityBadge from "@/components/molecules/CommunityBadge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await postService.getById(id);
      setPost(data);
      setVoteCount(data.voteCount);
    } catch (err) {
      setError(err.message || "Post not found");
    } finally {
      setLoading(false);
    }
  };

const handleVote = async (voteType) => {
    try {
      // Optimistic update
      const increment = voteType === "up" ? 1 : -1;
      setVoteCount(prev => prev + increment);
      
      await postService.vote(parseInt(id), voteType);
      toast.success(`Post ${voteType === "up" ? "upvoted" : "downvoted"}!`);
    } catch (error) {
      // Rollback on error
      const rollback = voteType === "up" ? -1 : 1;
      setVoteCount(prev => prev + rollback);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleCommunityClick = () => {
    navigate(`/community/${post.communityId}`);
  };

if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadPost} />;
  }

  if (!post) {
    return <ErrorView message="Post not found" />;
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Navigation */}
      <motion.button
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        <span>Back</span>
      </motion.button>

      {/* Post Content */}
      <motion.article 
        className="bg-white rounded-lg border border-gray-200 shadow-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="p-6">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.div
              onClick={handleCommunityClick}
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <CommunityBadge 
                name={post.communityName} 
                color={post.communityColor}
                size="md"
              />
            </motion.div>
            <span className="text-sm text-gray-500 flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              {timeAgo}
            </span>
          </div>

          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-6">
<div className="flex items-center space-x-3">
                <motion.button
                  className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 border border-gray-200 hover:border-green-200"
                  onClick={() => handleVote("up")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon name="ArrowUp" className="w-6 h-6" />
                </motion.button>
                
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Score</span>
                  <span className="text-2xl font-bold text-gray-800 min-w-[60px] text-center">
                    {voteCount}
                  </span>
                </div>
                
                <motion.button
                  className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border border-gray-200 hover:border-red-200"
                  onClick={() => handleVote("down")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon name="ArrowDown" className="w-6 h-6" />
                </motion.button>
              </div>
              <motion.button
                className="flex items-center space-x-2 text-gray-500 hover:text-secondary-600 transition-colors p-2 rounded-lg hover:bg-secondary-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="MessageCircle" className="w-5 h-5" />
                <span>Comment</span>
              </motion.button>

              <motion.button
                className="flex items-center space-x-2 text-gray-500 hover:text-accent-600 transition-colors p-2 rounded-lg hover:bg-accent-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Share2" className="w-5 h-5" />
                <span>Share</span>
              </motion.button>
            </div>

            <Button variant="secondary" size="sm">
              <ApperIcon name="Bookmark" className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </motion.article>

      {/* Comments Section Placeholder */}
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
        <div className="text-center py-8">
          <ApperIcon name="MessageCircle" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Comments feature coming soon!</p>
          <p className="text-sm text-gray-500 mt-1">
            Users will be able to discuss and reply to this post here.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetailPage;