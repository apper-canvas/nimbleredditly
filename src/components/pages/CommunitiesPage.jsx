import { useState } from "react";
import { motion } from "framer-motion";
import CommunityGrid from "@/components/organisms/CommunityGrid";
import CreateCommunityModal from "@/components/organisms/CreateCommunityModal";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CommunitiesPage = () => {
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);

  const handleCreateCommunity = () => {
    setIsCreateCommunityOpen(true);
  };

  const handleSearch = (searchTerm) => {
    // TODO: Implement search functionality
    console.log("Search communities:", searchTerm);
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
          <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
          <p className="text-gray-600 mt-1">
            Explore and join communities that match your interests
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleCreateCommunity}
          className="hidden md:flex"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Create Community
        </Button>
      </div>

      <div className="max-w-md">
        <SearchBar 
          placeholder="Search communities..."
          onSearch={handleSearch}
        />
      </div>

      <CommunityGrid onCreateCommunity={handleCreateCommunity} />

      <CreateCommunityModal 
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
      />
    </motion.div>
  );
};

export default CommunitiesPage;