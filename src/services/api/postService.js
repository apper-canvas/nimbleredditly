import postData from "@/services/mockData/posts.json";
import { communityService } from "@/services/api/communityService";
import { toast } from "react-toastify";
import React from "react";

let posts = [...postData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postService = {
  async getAll() {
    await delay(250);
return [...posts].sort((a, b) => {
      // Sort by vote count first (highest first)
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      // If vote counts are equal, sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
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
      .sort((a, b) => {
        // Sort by vote count first (highest first)
        if (b.voteCount !== a.voteCount) {
          return b.voteCount - a.voteCount;
        }
        // If vote counts are equal, sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  },

  async create(postData) {
    await delay(400);
    
try {
      const community = await communityService.getById(postData.communityId);
      
      const newPost = {
        Id: Math.max(...posts.map(p => p.Id), 0) + 1,
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
  },

  // Comments functionality
async getCommentsByPostId(postId) {
    await delay(200);
    const postComments = comments.filter(c => c.postId === parseInt(postId));
    return [...postComments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

async createComment(postId, content) {
    await delay(300);
    
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id), 0) + 1,
      postId: parseInt(postId),
      content: content,
      createdAt: new Date().toISOString(),
      parentId: null,
      voteCount: 0
    };
    
    comments.push(newComment);
    return { ...newComment };
  },

  async createReply(postId, parentId, content) {
    await delay(300);
    
    const newReply = {
      Id: Math.max(...comments.map(c => c.Id), 0) + 1,
      postId: parseInt(postId),
      parentId: parseInt(parentId),
      content: content,
      createdAt: new Date().toISOString(),
      voteCount: 0
    };
    
    comments.push(newReply);
    return { ...newReply };
},

  // Comment voting functionality
  async voteComment(commentId, voteType) {
    await delay(200);
    
    const comment = comments.find(c => c.Id === commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const increment = voteType === "up" ? 1 : -1;
    comment.voteCount = (comment.voteCount || 0) + increment;
    
    return { ...comment };
  }
};

// Mock comments data
let comments = [
  {
    Id: 1,
    postId: 1,
    content: "This is really interesting! Thanks for sharing.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    voteCount: 3,
    parentId: null
  },
  {
    Id: 2,
    postId: 1,
    content: "I completely agree with your analysis. Great points made throughout the post.",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    voteCount: 1,
    parentId: null
  },
  {
    Id: 3,
    postId: 2,
    content: "Could you elaborate more on this topic? I'd love to learn more.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    voteCount: 0,
    parentId: null
  },
  {
    Id: 4,
    postId: 1,
    content: "I had a similar experience! Really appreciate you sharing this perspective.",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    voteCount: 2,
    parentId: 1
  },
  {
    Id: 5,
    postId: 1,
    content: "Could you provide more details about the methodology you mentioned?",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    voteCount: 0,
    parentId: 2
  },
  {
    Id: 6,
    postId: 1,
    content: "Thanks for asking! I'd be happy to elaborate on that specific point.",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    voteCount: 1,
    parentId: 5
  }
];