import postData from "@/services/mockData/posts.json";
import { communityService } from "@/services/api/communityService";
import { toast } from "react-toastify";

let posts = [...postData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postService = {
  async getAll() {
    await delay(250);
    return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  },

  async getByCommunityId(communityId) {
    await delay(300);
    return [...posts]
      .filter(p => p.communityId === communityId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(postData) {
    await delay(400);
    
    try {
      const community = await communityService.getById(postData.communityId);
      
      const newPost = {
        Id: Math.max(...posts.map(p => p.Id)) + 1,
        title: postData.title,
        content: postData.content,
        communityId: postData.communityId.toString(),
        communityName: community.name,
        communityColor: community.color,
        createdAt: new Date().toISOString(),
        voteCount: 0
      };
      
      posts.push(newPost);
      await communityService.incrementPostCount(postData.communityId);
      toast.success("Post created successfully!");
      return { ...newPost };
    } catch (error) {
      throw new Error("Failed to create post: " + error.message);
    }
  },

  async update(id, updateData) {
    await delay(350);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    posts[index] = { ...posts[index], ...updateData };
    toast.success("Post updated successfully!");
    return { ...posts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    posts.splice(index, 1);
    toast.success("Post deleted successfully!");
    return true;
  },

async vote(id, voteType) {
    await delay(200);
    const postId = parseInt(id);
    const index = posts.findIndex(p => p.Id === postId);
    
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    if (voteType === "up") {
      posts[index].voteCount += 1;
    } else if (voteType === "down") {
      posts[index].voteCount -= 1;
    } else {
      throw new Error("Invalid vote type");
    }
    
    return { ...posts[index] };
  }
};