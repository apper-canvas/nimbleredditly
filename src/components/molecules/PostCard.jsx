import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import CommunityBadge from "@/components/molecules/CommunityBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PostCard = ({ post, className, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${post.Id}`);
  };

  const handleCommunityClick = (e) => {
    e.stopPropagation();
    navigate(`/community/${post.communityId}`);
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <motion.article
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-6 shadow-sm cursor-pointer",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="flex items-center justify-between mb-3">
        <motion.div
          onClick={handleCommunityClick}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <CommunityBadge 
            name={post.communityName} 
            color={post.communityColor}
            size="sm"
          />
        </motion.div>
        <span className="text-sm text-gray-500 flex items-center">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          {timeAgo}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
        {post.title}
      </h2>

      <p className="text-gray-600 leading-relaxed mb-4">
        {truncateContent(post.content)}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <motion.button
            className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ApperIcon name="ArrowUp" className="w-4 h-4" />
            <span className="text-sm font-medium">{post.voteCount}</span>
          </motion.button>
          <motion.button
            className="flex items-center space-x-1 text-gray-500 hover:text-secondary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ApperIcon name="MessageCircle" className="w-4 h-4" />
            <span className="text-sm">Discussion</span>
          </motion.button>
        </div>
        
        <motion.button
          className="flex items-center space-x-1 text-gray-500 hover:text-accent-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ApperIcon name="Share2" className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </motion.button>
      </div>
    </motion.article>
  );
};

export default PostCard;