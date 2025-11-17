import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { communityService } from "@/services/api/communityService";
import CommunityCard from "@/components/molecules/CommunityCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const CommunityGrid = ({ onCreateCommunity }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await communityService.getAll();
      setCommunities(data);
    } catch (err) {
      setError(err.message || "Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="communities" />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCommunities} />;
  }

  if (communities.length === 0) {
    return (
      <Empty
        title="No communities yet"
        description="Create the first community and start building amazing discussions!"
        actionText="Create First Community"
        onAction={onCreateCommunity}
        icon="Users"
      />
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {communities.map((community, index) => (
        <motion.div
          key={community.Id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <CommunityCard community={community} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CommunityGrid;