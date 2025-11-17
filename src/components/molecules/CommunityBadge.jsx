import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";
import { cn } from "@/utils/cn";
const CommunityBadge = ({ name, color = "#FF4500", size = "md", className, communityId, clickable = true, ...props }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (clickable && communityId) {
      navigate(`/community/${communityId}`);
    }
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        "bg-gray-100 text-gray-800 border border-gray-300",
        clickable && communityId ? "cursor-pointer hover:bg-gray-200 transition-colors duration-200" : "",
        sizeStyles[size],
        className
      )}
      style={{ 
        borderLeftColor: color,
        borderLeftWidth: '3px'
      }}
      onClick={handleClick}
      whileHover={clickable && communityId ? { scale: 1.05 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      r/{name}
    </motion.span>
  );
};

export default CommunityBadge;