import communityData from "@/services/mockData/communities.json";
import { toast } from "react-toastify";

let communities = [...communityData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communityService = {
  async getAll() {
    await delay(300);
    return [...communities];
  },

  async getById(id) {
    await delay(200);
    const community = communities.find(c => c.Id === parseInt(id));
    if (!community) {
      throw new Error("Community not found");
    }
    return { ...community };
  },

  async create(communityData) {
    await delay(400);
    
    // Check if community name already exists
    const existingCommunity = communities.find(c => 
      c.name.toLowerCase() === communityData.name.toLowerCase()
    );
    
    if (existingCommunity) {
      throw new Error("A community with this name already exists");
    }

    const newCommunity = {
      Id: Math.max(...communities.map(c => c.Id)) + 1,
      name: communityData.name,
      description: communityData.description,
      color: communityData.color,
      createdAt: new Date().toISOString(),
      postCount: 0
    };
    
    communities.push(newCommunity);
    toast.success("Community created successfully!");
    return { ...newCommunity };
  },

  async update(id, updateData) {
    await delay(350);
    const index = communities.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Community not found");
    }
    
    communities[index] = { ...communities[index], ...updateData };
    toast.success("Community updated successfully!");
    return { ...communities[index] };
  },

  async delete(id) {
    await delay(300);
    const index = communities.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Community not found");
    }
    
    communities.splice(index, 1);
    toast.success("Community deleted successfully!");
    return true;
  },

  async incrementPostCount(communityId) {
    const index = communities.findIndex(c => c.Id === parseInt(communityId));
    if (index !== -1) {
      communities[index].postCount += 1;
    }
  }
};