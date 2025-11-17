import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ onCreateCommunity, onSearch }) => {
  return (
    <motion.header 
      className="bg-white border-b border-gray-200 shadow-sm px-6 py-4"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon name="MessageCircle" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Redditly
            </h1>
          </motion.div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <SearchBar 
            placeholder="Search communities and posts..."
            onSearch={onSearch}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="secondary"
            onClick={onCreateCommunity}
            size="md"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Community
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;