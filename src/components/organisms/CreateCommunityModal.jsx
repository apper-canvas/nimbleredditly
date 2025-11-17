import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { communityService } from "@/services/api/communityService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const CreateCommunityModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#0079D3"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const colorOptions = [
    "#0079D3", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444",
    "#EC4899", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Community name is required";
    } else if (formData.name.length > 50) {
      newErrors.name = "Community name must be 50 characters or less";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.name.trim())) {
      newErrors.name = "Community name can only contain letters, numbers, and underscores";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be 200 characters or less";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await communityService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color
      });
      
      setFormData({ name: "", description: "", color: "#0079D3" });
      setErrors({});
      onClose();
      
      // Trigger a page refresh or update parent component
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", description: "", color: "#0079D3" });
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Community</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={loading}
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label={`Community Name (${formData.name.length}/50)`}
                  error={errors.name}
                  required
                >
                  <Input
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="e.g. technology, gaming, photography"
                    error={!!errors.name}
                    maxLength={50}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Only letters, numbers, and underscores allowed
                  </p>
                </FormField>

                <FormField
                  label={`Description (${formData.description.length}/200)`}
                  error={errors.description}
                  required
                >
                  <Textarea
                    value={formData.description}
                    onChange={handleChange("description")}
                    placeholder="What is this community about?"
                    error={!!errors.description}
                    maxLength={200}
                    rows={4}
                  />
                </FormField>

                <FormField label="Community Color">
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color 
                            ? "border-gray-800 scale-110" 
                            : "border-gray-300 hover:border-gray-400"
                        } transition-all duration-200`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Choose a color for your community badge
                  </p>
                </FormField>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.name.substring(0, 2).toUpperCase() || "CC"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        r/{formData.name || "community-name"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.description || "Community description..."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                        Create Community
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCommunityModal;