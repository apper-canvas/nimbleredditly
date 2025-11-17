import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { postService } from "@/services/api/postService";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import CommunityBadge from "@/components/molecules/CommunityBadge";


const PostCard = ({ post, className, onCommentClick, ...props }) => {
  const navigate = useNavigate();
  const [currentVoteCount, setCurrentVoteCount] = useState(post.voteCount || 0);

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
  const handleVote = async (e, voteType) => {
    e.stopPropagation();
    try {
      // Optimistic update
      const increment = voteType === "up" ? 1 : -1;
      setCurrentVoteCount(prev => prev + increment);
      
      await postService.vote(post.Id, voteType);
      toast.success(`Post ${voteType === "up" ? "upvoted" : "downvoted"}!`);
    } catch (error) {
      // Rollback on error
      const rollback = voteType === "up" ? -1 : 1;
      setCurrentVoteCount(prev => prev + rollback);
      toast.error("Failed to vote. Please try again.");
    }
  };
  return (
<motion.article
    className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        className
    )}
    onClick={handleClick}
    whileHover={{
        scale: 1.01
    }}
    transition={{
        duration: 0.2
    }}
    {...props}>
    <div className="flex">
        {/* Voting Section */}
        <div className="flex flex-col items-center space-y-1 mr-4 py-2">
            <motion.button
                className="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                onClick={e => handleVote(e, "up")}
                whileHover={{
                    scale: 1.1
                }}
                whileTap={{
                    scale: 0.9
                }}>
                <ApperIcon name="ArrowUp" className="w-5 h-5" />
            </motion.button>
            <span className="text-sm font-bold text-gray-700 min-w-[24px] text-center">
                {currentVoteCount}
            </span>
            <motion.button
                className="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                onClick={e => handleVote(e, "down")}
                whileHover={{
                    scale: 1.1
                }}
                whileTap={{
                    scale: 0.9
                }}>
                <ApperIcon name="ArrowDown" className="w-5 h-5" />
            </motion.button>
        </div>
        {/* Content Section */}
        <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-3">
                <motion.div
                    onClick={handleCommunityClick}
                    whileHover={{
                        scale: 1.05
                    }}
                    transition={{
                        duration: 0.2
                    }}>
                    <CommunityBadge name={post.communityName} color={post.communityColor} size="sm" />
                </motion.div>
                <span className="text-sm text-gray-500 flex items-center">
                    <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                    {timeAgo}
                </span>
            </div>
            <h2
                className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                {post.title}
            </h2>
{post.type === "link" ? (
                <div className="mb-4">
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 hover:text-blue-800 transition-colors text-sm font-medium"
                    >
                        <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                        {post.url}
                    </a>
                </div>
            ) : (
                <p className="text-gray-600 leading-relaxed mb-4">
                    {truncateContent(post.content)}
                </p>
            )}
            <div
                className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    <motion.button
className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onCommentClick) {
                                onCommentClick(post.Id);
                            }
                        }}>
                        <ApperIcon name="MessageSquare" className="w-4 h-4" />
                        <span className="text-sm font-medium">Comments</span>
                    </motion.button>
                    <motion.button
                        className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        onClick={e => e.stopPropagation()}>
                        <ApperIcon name="Share" className="w-4 h-4" />
                        <span className="text-sm font-medium">Share</span>
                    </motion.button>
                </div>
            </div>
        </div>
    </div></motion.article>
);
};

export default PostCard;