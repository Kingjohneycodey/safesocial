"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  MessageCircle,
  Settings,
  Bell,
  Search,
  Send,
  Image,
  FileText,
  Users,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  MoreVertical,
  Edit,
  Copy,
  ExternalLink,
  Key,
  Database,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);

  const profileTabs = [
    { id: "posts", label: "Posts", count: 12 },
    { id: "media", label: "Media", count: 8 },
    { id: "likes", label: "Likes", count: 45 },
    { id: "saved", label: "Saved", count: 3 },
  ];

  const userProfile = {
    address: "0x742d...35f1",
    name: "Alex Chen",
    bio: "Privacy advocate & blockchain developer. Building the future of decentralized social media.",
    location: "San Francisco, CA",
    joined: "January 2024",
    following: 234,
    followers: 1.2,
    posts: 12,
    isVerified: true,
    isEncrypted: true,
  };

  const userPosts = [
    {
      id: 1,
      content:
        "Just encrypted my first post on SafeSocial — no central servers, no data leaks. The future is decentralized 🌍",
      timestamp: "2h ago",
      likes: 15,
      comments: 3,
      shares: 2,
      isEncrypted: true,
    },
    {
      id: 2,
      content:
        "Privacy isn't just a feature, it's a fundamental right. SafeSocial gives us back control of our data.",
      timestamp: "1d ago",
      likes: 23,
      comments: 7,
      shares: 5,
      isEncrypted: true,
    },
    {
      id: 3,
      content:
        "Building the future of social media, one encrypted message at a time. Join the revolution!",
      timestamp: "3d ago",
      likes: 8,
      comments: 2,
      shares: 1,
      isEncrypted: true,
    },
  ];

  const Sidebar = () => (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800 h-screen"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-neutral-950" />
          </div>
          <h1 className="text-xl font-bold text-white">Profile</h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Privacy Status
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              All your data is encrypted and stored on IPFS
            </p>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
            <div className="flex items-center space-x-2 mb-2">
              <Key className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Encryption Keys
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Your private keys are stored securely in your wallet
            </p>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Data Ownership
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              You own 100% of your data and content
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ProfileHeader = () => (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 p-6"
    >
      <div className="flex items-start space-x-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-neutral-950 font-bold text-2xl">A</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-white">
              {userProfile.name}
            </h1>
            {userProfile.isVerified && (
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-neutral-950" />
              </div>
            )}
            <div className="flex items-center space-x-1 text-blue-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Encrypted</span>
            </div>
          </div>

          <p className="text-neutral-400 mb-4 max-w-md">{userProfile.bio}</p>

          <div className="flex items-center space-x-6 text-sm text-neutral-400 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{userProfile.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {userProfile.joined}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {userProfile.posts}
              </div>
              <div className="text-sm text-neutral-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {userProfile.following}
              </div>
              <div className="text-sm text-neutral-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {userProfile.followers}k
              </div>
              <div className="text-sm text-neutral-400">Followers</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-400 hover:bg-blue-500 text-neutral-950 font-semibold"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-400 hover:text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-400 hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ProfileTabs = () => (
    <div className="bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800">
      <div className="flex space-x-8 px-6">
        {profileTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-green-400 text-blue-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <span className="font-medium">{tab.label}</span>
            <span className="ml-2 text-sm opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>
    </div>
  );

  const PostsContent = () => (
    <div className="p-6 space-y-6">
      {userPosts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-200"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-neutral-950 font-bold">A</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-white font-medium">
                  {userProfile.name}
                </span>
                <span className="text-neutral-500 text-sm">
                  {post.timestamp}
                </span>
                {post.isEncrypted && (
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs">Encrypted</span>
                  </div>
                )}
              </div>

              <p className="text-neutral-300 mb-4 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-neutral-500 hover:text-white transition-colors">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-neutral-500 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-neutral-500 hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <ProfileHeader />
          <ProfileTabs />

          <AnimatePresence mode="wait">
            {activeTab === "posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PostsContent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
