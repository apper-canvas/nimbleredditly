import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { postService } from "@/services/api/postService";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";

const PostFeed = ({ communityId = null, sortBy = 'hot', onCreatePost }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
useEffect(() => {
    loadPosts();
  }, [communityId, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let data;
if (communityId) {
        data = await postService.getByCommunityId(communityId, sortBy);
      } else {
        data = await postService.getAll(sortBy);
      }
      
      setPosts(data);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="feed" />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadPosts} />;
  }

  if (posts.length === 0) {
    return (
      <Empty
        title="No posts yet"
        description={communityId 
          ? "This community is waiting for its first post. Be the pioneer!"
          : "The feed is empty. Start the conversation by creating the first post!"
        }
        actionText="Create First Post"
        onAction={onCreatePost}
        icon="MessageCircle"
      />
    );
  }

  return (
<motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
{posts.map((post, index) => (
        <motion.div
          key={post.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PostCard 
            post={post} 
            onCommentClick={(postId) => navigate(`/posts/${postId}`)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostFeed;