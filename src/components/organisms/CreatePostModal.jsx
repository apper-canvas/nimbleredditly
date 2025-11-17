import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { postService } from "@/services/api/postService";
import { communityService } from "@/services/api/communityService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const CreatePostModal = ({ isOpen, onClose }) => {
const [formData, setFormData] = useState({
    title: "",
    content: "",
    url: "",
    communityId: ""
  });
  const [postType, setPostType] = useState("text"); // "text" or "link"
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCommunities();
    }
  }, [isOpen]);

  const loadCommunities = async () => {
    try {
      setLoadingCommunities(true);
      const data = await communityService.getAll();
      setCommunities(data);
    } catch (error) {
      toast.error("Failed to load communities");
    } finally {
      setLoadingCommunities(false);
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 300) {
      newErrors.title = "Title must be 300 characters or less";
    }
    
    if (postType === "text") {
      if (!formData.content.trim()) {
        newErrors.content = "Content is required";
      }
    } else if (postType === "link") {
      if (!formData.url.trim()) {
        newErrors.url = "URL is required";
      } else {
        try {
          new URL(formData.url);
        } catch {
          newErrors.url = "Please enter a valid URL";
        }
      }
    }
    
    if (!formData.communityId) {
      newErrors.communityId = "Please select a community";
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
const postData = {
        title: formData.title.trim(),
        communityId: formData.communityId,
        type: postType
      };
      
      if (postType === "text") {
        postData.content = formData.content.trim();
      } else {
        postData.url = formData.url.trim();
      }
      
      await postService.create(postData);
      
setFormData({ title: "", content: "", url: "", communityId: "" });
      setPostType("text");
      setErrors({});
      onClose();
      
      // Trigger a page refresh or update parent component
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to create post");
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
  
  const handlePostTypeChange = (type) => {
    setPostType(type);
    // Clear errors when switching types
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.content;
      delete newErrors.url;
      return newErrors;
    });
  };

  const handleClose = () => {
    if (!loading) {
setFormData({ title: "", content: "", url: "", communityId: "" });
      setPostType("text");
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
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
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
              {loadingCommunities ? (
                <Loading type="default" />
              ) : (
<form onSubmit={handleSubmit} className="space-y-6">
                  {/* Post Type Toggle */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Post Type
                    </Label>
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handlePostTypeChange("text")}
                        className={cn(
                          "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                          postType === "text"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <ApperIcon name="FileText" size={16} className="inline mr-2" />
                        Text Post
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePostTypeChange("link")}
                        className={cn(
                          "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                          postType === "link"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <ApperIcon name="Link" size={16} className="inline mr-2" />
                        Link Post
                      </button>
                    </div>
                  </div>
                  <FormField
                    label="Community"
                    error={errors.communityId}
                    required
                  >
                    <Select
                      value={formData.communityId}
                      onChange={handleChange("communityId")}
                      error={!!errors.communityId}
                    >
                      <option value="">Select a community</option>
                      {communities.map((community) => (
                        <option key={community.Id} value={community.Id}>
                          r/{community.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField
                    label={`Title (${formData.title.length}/300)`}
                    error={errors.title}
                    required
                  >
                    <Input
                      value={formData.title}
                      onChange={handleChange("title")}
                      placeholder="What's your post about?"
                      error={!!errors.title}
                      maxLength={300}
                    />
                  </FormField>

{postType === "text" ? (
                    <FormField
                      label="Content"
                      error={errors.content}
                      required
                    >
                      <Textarea
                        value={formData.content}
                        onChange={handleChange("content")}
                        placeholder="Tell us more..."
                        error={!!errors.content}
                        rows={8}
                      />
                    </FormField>
                  ) : (
                    <FormField
                      label="URL"
                      error={errors.url}
                      required
                    >
                      <Input
                        type="url"
                        value={formData.url}
                        onChange={handleChange("url")}
                        placeholder="https://example.com"
                        error={!!errors.url}
                      />
                    </FormField>
                  )}

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
                          <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                          Create Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;