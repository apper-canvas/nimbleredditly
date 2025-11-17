import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ApperIcon name="AlertTriangle" className="w-12 h-12 text-primary-600" />
      </motion.div>
      
      <motion.h1 
        className="text-6xl font-bold text-gray-900 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        404
      </motion.h1>
      
      <motion.h2 
        className="text-2xl font-semibold text-gray-700 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        Page Not Found
      </motion.h2>
      
      <motion.p 
        className="text-gray-600 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back to exploring amazing communities!
      </motion.p>
      
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Button onClick={() => navigate("/")} variant="primary">
          <ApperIcon name="Home" className="w-4 h-4 mr-2" />
          Go Home
        </Button>
        <Button onClick={() => navigate("/communities")} variant="secondary">
          <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2" />
          Browse Communities
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;