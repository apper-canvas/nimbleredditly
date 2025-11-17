import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { communityService } from "@/services/api/communityService";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import SortingTabs from "@/components/molecules/SortingTabs";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import PostFeed from "@/components/organisms/PostFeed";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import Button from "@/components/atoms/Button";

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState('hot');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(false);
  useEffect(() => {
loadCommunity();
    checkMembership();
  }, [id]);

  const refreshCommunityData = async () => {
    try {
      const updatedCommunity = await communityService.getById(id);
      setCommunity(updatedCommunity);
    } catch (err) {
      console.error("Error refreshing community data:", err);
    }
  };

const loadCommunity = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await communityService.getById(id);
      setCommunity(data);
    } catch (err) {
      setError(err.message || "Community not found");
    } finally {
      setLoading(false);
    }
  };

  const checkMembership = async () => {
    try {
      const membershipStatus = await communityService.isUserMember(id);
      setIsMember(membershipStatus);
    } catch (err) {
      console.error("Error checking membership:", err);
    }
  };

const handleJoinLeave = async () => {
    try {
      setMembershipLoading(true);
      if (isMember) {
        await communityService.leaveCommunity(id);
        setIsMember(false);
      } else {
        await communityService.joinCommunity(id);
        setIsMember(true);
      }
      // Refresh community data to get updated member count
      await refreshCommunityData();
    } catch (err) {
      console.error("Error updating membership:", err);
    } finally {
      setMembershipLoading(false);
    }
  };

const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  if (loading) {
    return <Loading type="default" />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCommunity} />;
  }

  if (!community) {
    return <ErrorView message="Community not found" />;
  }

  const createdDate = formatDistanceToNow(new Date(community.createdAt), { addSuffix: true });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Community Header */}
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: community.color }}
            >
              {community.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">r/{community.name}</h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                {community.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                  Created {createdDate}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="MessageSquare" className="w-4 h-4 mr-1" />
                  {community.postCount} posts
                </span>
<span className="flex items-center">
                  <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                  {community.memberCount?.toLocaleString() || '0'} members
                </span>
              </div>
            </div>
          </div>
          
<div className="flex items-center space-x-3">
            <Button
              variant={isMember ? "secondary" : "primary"}
              size="md"
              onClick={handleJoinLeave}
              disabled={membershipLoading}
            >
              <ApperIcon 
                name={isMember ? "UserMinus" : "UserPlus"} 
                className="w-4 h-4 mr-2" 
              />
              {membershipLoading 
                ? (isMember ? "Leaving..." : "Joining...") 
                : (isMember ? "Leave Community" : "Join Community")
              }
</Button>
            <Button
              variant="secondary"
              onClick={handleCreatePost}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Post
            </Button>
</div>
        </div>
      </motion.div>
        
      {/* Sorting and Create Post Controls */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SortingTabs
          activeSort={sortBy}
          onSortChange={setSortBy}
        />
        <Button onClick={() => setIsCreatePostOpen(true)} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          New Post
        </Button>
      </motion.div>

      {/* Back Navigation */}
      <motion.button
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        <span>Back</span>
      </motion.button>

      {/* Posts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
<PostFeed communityId={id} sortBy={sortBy} onCreatePost={handleCreatePost} />
      </motion.div>

      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </motion.div>
  );
};

export default CommunityDetailPage;