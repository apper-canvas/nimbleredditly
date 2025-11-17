import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  className,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)} {...props}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          className="pl-10 pr-4"
        />
      </div>
    </form>
  );
};

export default SearchBar;