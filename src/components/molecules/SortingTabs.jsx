import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const SortingTabs = ({ activeSort, onSortChange, className }) => {
  const sortOptions = [
    { 
      key: 'hot', 
      label: 'Hot', 
      description: 'Popular posts with high engagement' 
    },
    { 
      key: 'new', 
      label: 'New', 
      description: 'Recently posted content' 
    },
    { 
      key: 'top', 
      label: 'Top', 
      description: 'Highest scoring posts' 
    }
  ];

  return (
    <div className={cn("flex bg-gray-100 rounded-lg p-1", className)}>
      {sortOptions.map((option) => (
        <motion.button
          key={option.key}
          onClick={() => onSortChange(option.key)}
          className={cn(
            "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            activeSort === option.key
              ? "text-white bg-primary-500 shadow-sm"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={option.description}
        >
          {option.label}
          {activeSort === option.key && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary-500 rounded-md -z-10"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default SortingTabs;