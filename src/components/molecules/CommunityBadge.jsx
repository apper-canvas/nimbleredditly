import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const CommunityBadge = ({ 
  name, 
  color = "#0079D3", 
  size = "sm",
  className,
  ...props 
}) => {
  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center font-medium rounded-full text-white shadow-sm",
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      r/{name}
    </motion.span>
  );
};

export default CommunityBadge;