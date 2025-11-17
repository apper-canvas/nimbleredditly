import { useState } from "react";
import { motion } from "framer-motion";
import PostFeed from "@/components/organisms/PostFeed";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import SortingTabs from "@/components/molecules/SortingTabs";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const HomePage = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
const [sortBy, setSortBy] = useState('hot');
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
<div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Feed</h1>
          <SortingTabs
            activeSort={sortBy}
            onSortChange={setSortBy}
            className="mb-0"
          />
        </div>
        <Button onClick={() => setIsCreatePostOpen(true)} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Create Post
        </Button>
      </div>

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

<PostFeed sortBy={sortBy} onCreatePost={handleCreatePost} />

      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </motion.div>
  );
};

export default HomePage;