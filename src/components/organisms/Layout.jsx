import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import CreateCommunityModal from "@/components/organisms/CreateCommunityModal";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Layout = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const handleCreateCommunity = () => {
    setIsCreateCommunityOpen(true);
  };

  const handleSearch = (searchTerm) => {
    // TODO: Implement search functionality
    console.log("Search:", searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onCreateCommunity={handleCreateCommunity}
        onSearch={handleSearch}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onCreatePost={handleCreatePost}
          isMobile={false}
        />
        
        <Sidebar 
          onCreatePost={handleCreatePost}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile menu button */}
      <motion.button
        className="fixed bottom-6 left-6 lg:hidden bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg z-30"
        onClick={() => setIsMobileSidebarOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name="Menu" className="w-6 h-6" />
      </motion.button>

      {/* Mobile create post FAB */}
      <motion.button
        className="fixed bottom-6 right-6 lg:hidden bg-accent-500 hover:bg-accent-600 text-white p-3 rounded-full shadow-lg z-30"
        onClick={handleCreatePost}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </motion.button>

      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
      
      <CreateCommunityModal 
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
      />
    </div>
  );
};

export default Layout;