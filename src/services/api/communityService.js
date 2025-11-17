import communityData from "@/services/mockData/communities.json";
import { toast } from "react-toastify";
import membershipData from "@/services/mockData/memberships.json";
import React from "react";


let communities = [...communityData];
let memberships = [...membershipData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communityService = {
async getAll() {
    await delay(300);
    const communitiesWithCounts = communities.map(community => ({
      ...community,
      memberCount: this.getMemberCount(community.Id)
    }));
    return communitiesWithCounts;
  },

async getById(id) {
    await delay(200);
    const community = communities.find(c => c.Id === parseInt(id));
    if (!community) {
      throw new Error("Community not found");
    }
    return { 
      ...community, 
      memberCount: this.getMemberCount(parseInt(id))
    };
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
  },

  async joinCommunity(communityId) {
    await delay(200);
    const userId = 1; // Mock user ID
    
    const existingMembership = memberships.find(m => 
      m.userId === userId && m.communityId === parseInt(communityId)
    );
    
    if (existingMembership) {
      throw new Error("Already a member of this community");
    }

    const newMembership = {
      Id: Math.max(...memberships.map(m => m.Id)) + 1,
      userId: userId,
      communityId: parseInt(communityId),
      joinedAt: new Date().toISOString()
    };
    
    memberships.push(newMembership);
    toast.success("Successfully joined community!");
    return true;
  },

  async leaveCommunity(communityId) {
    await delay(200);
    const userId = 1; // Mock user ID
    
    const membershipIndex = memberships.findIndex(m => 
      m.userId === userId && m.communityId === parseInt(communityId)
    );
    
    if (membershipIndex === -1) {
      throw new Error("Not a member of this community");
    }

    memberships.splice(membershipIndex, 1);
    toast.success("Successfully left community!");
    return true;
  },

  async getUserMemberships(userId = 1) {
    await delay(150);
    const userMemberships = memberships.filter(m => m.userId === userId);
    const joinedCommunities = [];
    
    for (const membership of userMemberships) {
      const community = communities.find(c => c.Id === membership.communityId);
      if (community) {
        joinedCommunities.push({
          ...community,
          joinedAt: membership.joinedAt
        });
      }
    }
    
    return joinedCommunities;
  },

async isUserMember(communityId, userId = 1) {
    await delay(100);
    return memberships.some(m => 
      m.userId === userId && m.communityId === parseInt(communityId)
    );
  },

  getMemberCount(communityId) {
    return memberships.filter(m => m.communityId === parseInt(communityId)).length;
  }
};