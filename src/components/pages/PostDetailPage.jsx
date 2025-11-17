import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { postService } from "@/services/api/postService";
import ApperIcon from "@/components/ApperIcon";
import CommunityBadge from "@/components/molecules/CommunityBadge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voteCount, setVoteCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

useEffect(() => {
    loadPost();
    loadComments();
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

  const loadComments = async () => {
    try {
      const data = await postService.getCommentsByPostId(id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await postService.createComment(id, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
};

  const handleCommentVote = async (commentId, voteType) => {
    try {
      // Optimistic update
      const increment = voteType === "up" ? 1 : -1;
      setComments(prev => prev.map(comment => 
        comment.Id === commentId 
          ? { ...comment, voteCount: (comment.voteCount || 0) + increment }
          : comment
      ));
      
      await postService.voteComment(commentId, voteType);
      toast.success(`Comment ${voteType === "up" ? "upvoted" : "downvoted"}!`);
    } catch (error) {
      // Rollback on error
      const rollback = voteType === "up" ? -1 : 1;
      setComments(prev => prev.map(comment => 
        comment.Id === commentId 
          ? { ...comment, voteCount: (comment.voteCount || 0) + rollback }
          : comment
      ));
      toast.error("Failed to vote. Please try again.");
    }
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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments ({comments.length})</h2>
        
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex flex-col space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
              rows="3"
              disabled={submitting}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border-l-2 border-gray-200 pl-4 py-3"
              >
<p className="text-gray-800 mb-2">{comment.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="Clock" size={14} className="mr-1" />
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCommentVote(comment.Id, "up")}
                      className="p-1 rounded-full hover:bg-green-100 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <ApperIcon name="ChevronUp" size={16} />
                    </button>
                    <span className="text-sm font-medium text-gray-600 min-w-[20px] text-center">
                      {comment.voteCount || 0}
                    </span>
                    <button
                      onClick={() => handleCommentVote(comment.Id, "down")}
                      className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <ApperIcon name="ChevronDown" size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ApperIcon name="MessageCircle" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No comments yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PostDetailPage;