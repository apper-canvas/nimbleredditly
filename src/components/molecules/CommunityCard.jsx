import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CommunityCard = ({ community, className, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/community/${community.Id}`);
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-6 shadow-sm cursor-pointer",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
          style={{ backgroundColor: community.color }}
        >
          {community.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">r/{community.name}</h3>
        </div>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">
        {truncateDescription(community.description)}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
<div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <ApperIcon name="Users" className="w-4 h-4" />
            <span className="text-sm">
              {community.memberCount?.toLocaleString() || '0'} members
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <ApperIcon name="MessageSquare" className="w-4 h-4" />
            <span className="text-sm">{community.postCount} posts</span>
          </div>
        </div>
        
        <motion.button
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            // Handle join/leave community
          }}
        >
          Join
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CommunityCard;