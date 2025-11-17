import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { communityService } from "@/services/api/communityService";
import { cn } from "@/utils/cn";
const Sidebar = ({ onCreatePost, isMobile = false, isOpen = false, onClose }) => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);

  useEffect(() => {
    loadJoinedCommunities();
  }, []);

const loadJoinedCommunities = async () => {
    try {
      setCommunitiesLoading(true);
      const communities = await communityService.getUserMemberships();
      // Enhance communities with member counts
      const communitiesWithCounts = await Promise.all(
        communities.map(async (community) => {
          const fullCommunity = await communityService.getById(community.Id);
          return { ...community, memberCount: fullCommunity.memberCount };
        })
      );
      setJoinedCommunities(communitiesWithCounts);
    } catch (err) {
      console.error("Error loading joined communities:", err);
    } finally {
      setCommunitiesLoading(false);
    }
  };
const navItems = [
    { path: "/", label: "Home", icon: "Home" },
    { path: "/communities", label: "Communities", icon: "Grid3X3" }
  ];

  const SidebarContent = () => (
<div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
            <ApperIcon name="MessageCircle" className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Redditly</h2>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-gray-100 hover:text-gray-900",
                isActive
                  ? "bg-primary-50 text-primary-700 border-l-4 border-l-primary-500 font-medium"
                  : "text-gray-600"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary-600" : "text-gray-500"
                  )} 
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* My Communities Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              My Communities
            </h3>
            {communitiesLoading && (
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>
          
          {!communitiesLoading && joinedCommunities.length === 0 && (
            <p className="text-sm text-gray-500 italic px-4 py-2">
              No communities joined yet
            </p>
          )}

          {joinedCommunities.map((community) => (
            <NavLink
              key={community.Id}
              to={`/communities/${community.Id}`}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200",
                  "hover:bg-gray-100 hover:text-gray-900",
                  isActive
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-600"
                )
              }
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: community.color }}
              />
              <span className="text-sm truncate">{community.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

<div className="p-6 border-t border-gray-200">
        <Button 
          variant="primary" 
onClick={() => {
            onCreatePost();
            if (isMobile) onClose();
            // Refresh joined communities to show updated member counts
            loadJoinedCommunities();
          }}
          className="w-full justify-center"
          size="lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Create Post
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
        <motion.aside
          className={cn(
            "fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden",
            "transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          <SidebarContent />
        </motion.aside>
      </>
    );
  }

  return (
    <motion.aside 
      className="w-64 bg-white border-r border-gray-200 h-full hidden lg:flex flex-col"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SidebarContent />
    </motion.aside>
  );
};

export default Sidebar;