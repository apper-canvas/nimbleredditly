import postData from "@/services/mockData/posts.json";
import { communityService } from "@/services/api/communityService";
import { toast } from "react-toastify";

let posts = [...postData];

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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postService = {
async getAll(sortBy = 'hot') {
    await delay(250);
    const sortedPosts = [...posts];
    
    switch (sortBy) {
      case 'new':
        return sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'top':
        return sortedPosts.sort((a, b) => b.voteCount - a.voteCount);
      case 'hot':
      default:
        return sortedPosts.sort((a, b) => {
          // Hot algorithm: vote count weighted by recency
          const aHotScore = a.voteCount / (Math.log(Math.max(1, (Date.now() - new Date(a.createdAt)) / (1000 * 60 * 60))) + 1);
          const bHotScore = b.voteCount / (Math.log(Math.max(1, (Date.now() - new Date(b.createdAt)) / (1000 * 60 * 60))) + 1);
          
          if (Math.abs(bHotScore - aHotScore) > 0.1) {
            return bHotScore - aHotScore;
          }
          // Fallback to vote count for similar hot scores
          return b.voteCount - a.voteCount;
        });
    }
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  },

async getByCommunityId(communityId, sortBy = 'hot') {
    await delay(300);
    const communityPosts = [...posts].filter(p => p.communityId === communityId.toString());
    
    switch (sortBy) {
      case 'new':
        return communityPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'top':
        return communityPosts.sort((a, b) => b.voteCount - a.voteCount);
      case 'hot':
      default:
        return communityPosts.sort((a, b) => {
          // Hot algorithm: vote count weighted by recency
          const aHotScore = a.voteCount / (Math.log(Math.max(1, (Date.now() - new Date(a.createdAt)) / (1000 * 60 * 60))) + 1);
          const bHotScore = b.voteCount / (Math.log(Math.max(1, (Date.now() - new Date(b.createdAt)) / (1000 * 60 * 60))) + 1);
          
          if (Math.abs(bHotScore - aHotScore) > 0.1) {
            return bHotScore - aHotScore;
          }
          // Fallback to vote count for similar hot scores
          return b.voteCount - a.voteCount;
        });
    }
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
  },

  // Search functionality
  async searchPosts(query) {
    await delay(300);
    
    if (!query || query.trim() === '') {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    const filteredPosts = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const contentMatch = post.content.toLowerCase().includes(searchTerm);
      return titleMatch || contentMatch;
    });
    
    // Sort search results by relevance (title matches first, then by vote count)
    return filteredPosts.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      // If both or neither have title matches, sort by vote count
      return b.voteCount - a.voteCount;
    });
  }
};