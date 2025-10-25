"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/app/services/getPosts";
import ConnectWallet from "../_components/ConnectWallet";

const Feed = () => {
  const [posts, setPosts] = useState<Array<{
    id: string;
    author: string;
    owner: string;
    creatorName?: string;
    content: string;
    description?: string;
    timestamp: string;
    createdAt?: string;
    likes: number;
    comments: number;
    shares: number;
    isEncrypted: boolean;
    isLiked: boolean;
    isBookmarked: boolean;
    isPublic: boolean;
    media?: {
      type: "image" | "video";
      url: string;
      thumbnail?: string;
    }[];
    fileId?: string;
    price?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? undefined : undefined;
      const data = await getPosts(token);
      setPosts(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center text-neutral-400">Loading posts...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
            {posts
              .sort((a, b) => {
                // Sort by createdAt (newest first), fallback to id if createdAt is not available
                const aTime = a.createdAt ? Number(a.createdAt) : Number(a.id);
                const bTime = b.createdAt ? Number(b.createdAt) : Number(b.id);
                return bTime - aTime;
              })
              .map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              id: Number(post.id)
            }}
            onLike={() => {}}
            onComment={() => {}}
            onShare={() => {}}
            onBookmark={() => {}}
          />
        ))}
    </div>
  );
};

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refreshPosts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout activeTab="feed" onPostCreated={refreshPosts}>
        <ConnectWallet />
        <div className="mb-4"></div>
      <Feed key={refreshTrigger} />
    </DashboardLayout>
  );
}
