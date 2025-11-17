import { useState } from "react";
import { motion } from "framer-motion";
import PostFeed from "@/components/organisms/PostFeed";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const HomePage = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Feed</h1>
          <p className="text-gray-600 mt-1">
            Discover the latest posts from all communities
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreatePost}
          className="hidden md:flex"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Create Post
        </Button>
      </div>

      <PostFeed onCreatePost={handleCreatePost} />

      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </motion.div>
  );
};

export default HomePage;