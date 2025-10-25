"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  MessageCircle,
  Settings,
  Bell,
  Search,
  Plus,
  Send,
  Users,
  Globe,
  EyeOff,
  Menu,
  X,
  Music,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MediaUpload from "./MediaUpload";
import Image from "next/image";
import { useAccount, useWalletClient } from 'wagmi';
import { createPostOnchainWithUser } from "@/app/services/createPost";
import { useToast } from "@/components/ui/toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onPostCreated?: () => void;
}

export default function DashboardLayout({
  children,
  activeTab = "feed",
  onPostCreated,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postPrice, setPostPrice] = useState("0");

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { showToast } = useToast();
  console.log("walletClient", walletClient);
  console.log("address", address);
  console.log("isConnected", isConnected);
  // Helper to get ethers.js signer from wagmi walletClient
  const getSigner = useCallback(async () => {
    if (!walletClient) return null;
    const provider = new (await import("ethers")).BrowserProvider(window.ethereum);
    return provider.getSigner(walletClient.account.address);
  }, [walletClient]);

  const tabs = useMemo(
    () => [
      { id: "feed", label: "Feed", icon: Globe, href: "/dashboard" },
      {
        id: "messages",
        label: "Messages",
        icon: MessageCircle,
        href: "/dashboard/messages",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        href: "/dashboard/notifications",
      },
      {
        id: "profile",
        label: "Profile",
        icon: Users,
        href: "/dashboard/profile",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
      },
    ],
    []
  );

  // Close mobile menu on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab, isMobileMenuOpen]);

  const handleMediaSelect = useCallback((media: File[]) => {
    setSelectedMedia(media);
    setShowMediaUpload(false);
  }, []);

  const handlePostSubmit = useCallback(async () => {
    if (selectedMedia.length === 0) {
      showToast('Please select a file to post.', 'warning');
      return;
    }
    if (!newPost.trim()) {
      showToast('Please add a description to your post.', 'warning');
      return;
    }
    if (!walletClient || !isConnected) {
      setPostError('Please connect your wallet.');
      return;
    }
    setPostLoading(true);
    setPostError(null);
    setPostSuccess(false);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('Could not obtain wallet signer.');
      const dataVaultAddress = process.env.NEXT_PUBLIC_DATA_VAULT_ADDRESS;
      const postRegistryAddress = process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS;
      if (!dataVaultAddress || !postRegistryAddress) throw new Error('Contract addresses not set');
      await createPostOnchainWithUser({
        file: selectedMedia[0],
        description: newPost,
        price: postPrice,
        isPublic: !isEncrypted ? true : false,
        pinataJWT: process.env.NEXT_PUBLIC_PINATA_JWT || "",
        pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || "",
        dataVaultAddress,
        postRegistryAddress,
        signer,
      });
      setPostSuccess(true);
      setIsComposing(false);
      setNewPost("");
      setSelectedMedia([]);
      setPostPrice("0");
      // Trigger posts refresh
      onPostCreated?.();
    } catch (err: unknown) {
      setPostError(err instanceof Error ? err.message : String(err));
    } finally {
      setPostLoading(false);
    }
  }, [newPost, selectedMedia, isEncrypted, postPrice, walletClient, isConnected, getSigner, onPostCreated]);

  const Sidebar = useMemo(
    () => (
      <div className="hidden lg:block w-64 bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800 h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Image src="/logo.png" alt="SafeSocial" width={50} height={50} />
            <h1 className="text-xl font-bold text-white">SafeSocial</h1>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link key={tab.id} href={tab.href}>
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[var(--secondary-color)]/20 text-[var(--secondary-color)] border border-[var(--secondary-color)]/30"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-4 h-4 text-[var(--secondary-color)]" />
              <span className="text-sm font-medium text-[var(--secondary-color)]">
                Privacy Status
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              All communications are end-to-end encrypted
            </p>
          </div>
        </div>
      </div>
    ),
    [tabs, activeTab]
  );

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const MobileSidebar = useMemo(
    () => (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={handleMobileMenuClose}
            />
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed left-0 top-0 w-80 h-full bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800 z-50 lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/logo.png"
                      alt="SafeSocial"
                      width={100}
                      height={100}
                    />
                    <h1 className="text-xl font-bold text-white">SafeSocial</h1>
                  </div>
                  <button
                    onClick={handleMobileMenuClose}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Link key={tab.id} href={tab.href}>
                        <button
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            activeTab === tab.id
                              ? "bg-[var(--secondary-color)]/20 text-[var(--secondary-color)] border border-[var(--secondary-color)]/30"
                              : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-4 h-4 text-[var(--secondary-color)]" />
                    <span className="text-sm font-medium text-[var(--secondary-color)]">
                      Privacy Status
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    All communications are end-to-end encrypted
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    ),
    [isMobileMenuOpen, tabs, activeTab, handleMobileMenuClose]
  );

  const handleNewPostChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewPost(e.target.value);
    },
    []
  );


  const handleCancelCompose = useCallback(() => {
    setIsComposing(false);
    setNewPost("");
    setSelectedMedia([]);
    setPostPrice("0");
  }, []);

  const handleMediaUploadClick = useCallback(() => {
    setShowMediaUpload(true);
  }, []);

  const handleRemoveMedia = useCallback((index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const PostComposer = useMemo(
    () => (
      <AnimatePresence>
        {isComposing && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleCancelCompose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Create New Post</h2>
                  <button
                    onClick={handleCancelCompose}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
                <span className="text-neutral-950 font-bold text-sm">0x</span>
              </div>
              <div>
                <p className="text-white font-medium">Your Wallet</p>
                <p className="text-xs text-neutral-400">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                </p>
              </div>
            </div>

            <textarea
              value={newPost}
              onChange={handleNewPostChange}
              placeholder="Share something encrypted and secure..."
              className="w-full bg-transparent text-white placeholder-neutral-500 resize-none outline-none text-lg mb-4"
              rows={4}
            />

            {/* Media Preview */}
            {selectedMedia.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {selectedMedia.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden">
                        {(() => {
                          console.log('🔍 File type check:', {
                            fileName: file.name,
                            fileType: file.type,
                            isImage: file.type.startsWith("image/"),
                            isVideo: file.type.startsWith("video/"),
                            allTypes: file.type
                          });
                          
                          if (file.type.startsWith("image/")) {
                            return (
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            );
                          } else if (file.type.startsWith("video/")) {
                            console.log('🎥 Rendering video element for:', file.name);
                            return (
                              <div className="w-full h-full relative">
                                <video
                                  src={URL.createObjectURL(file)}
                                  className="w-full h-full object-cover"
                                  controls
                                  preload="metadata"
                                  autoPlay={false}
                                  muted={false}
                                  playsInline
                                  onLoadStart={() => console.log('🎬 Video load started')}
                                  onCanPlay={() => console.log('🎬 Video can play')}
                                  onError={(e) => console.log('❌ Video error:', e)}
                                  onLoadedData={() => console.log('🎬 Video data loaded')}
                                  style={{ 
                                    backgroundColor: '#000',
                                    minHeight: '200px',
                                    display: 'block'
                                  }}
                                >
                                  Your browser does not support the video tag.
                                </video>
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {file.name}
                                </div>
                              </div>
                            );
                          } else {
                            console.log('❓ Unknown file type:', file.type);
                            return (
                              <div className="w-full h-full flex items-center justify-center">
                                <Music className="w-8 h-8 text-[var(--secondary-color)]" />
                              </div>
                            );
                          }
                        })()}
                      </div>
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleMediaUploadClick}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                {/* <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <Music className="w-5 h-5" />
                </button>
                <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <Camera className="w-5 h-5" />
                </button> */}
                <button
                  // onClick={handleEncryptionToggle}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                    isEncrypted
                      ? "bg-[var(--secondary-color)]/20 text-[var(--secondary-color)] border border-[var(--secondary-color)]/30"
                      : "bg-red-400/20 text-red-400 border border-red-400/30"
                  }`}
                >
                  {isEncrypted ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isEncrypted ? "Encrypted" : "Public"}
                  </span>
                </button>
                
                {/* Price Input */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-400">Price (BDAG):</span>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={postPrice}
                    onChange={(e) => setPostPrice(e.target.value)}
                    placeholder="0"
                    className="w-20 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-[var(--secondary-color)]/50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancelCompose}
                  className="border-neutral-700 text-neutral-400 hover:text-white"
                  disabled={postLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() && selectedMedia.length === 0 || postLoading}
                  className="bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-neutral-950 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {postLoading ? "Posting..." : <><Send className="w-4 h-4 mr-2" />Post</>}
                </Button>
              </div>
            </div>
                {postError && <p className="text-red-500 text-xs mt-2">{postError}</p>}
                {postSuccess && <p className="text-green-400 text-xs mt-2">Post created and onchain!</p>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    ),
    [
      isComposing,
      newPost,
      selectedMedia,
      isEncrypted,
      handleNewPostChange,
      handleCancelCompose,
      handleMediaUploadClick,
      handleRemoveMedia,
      handlePostSubmit,
      postLoading,
      postError,
      postSuccess,
      address,
      postPrice,
    ]
  );

  const handleMobileMenuOpen = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleNewPostClick = useCallback(() => {
    setIsComposing(true);
  }, []);

  const Header = useMemo(
    () => (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 p-4 lg:p-6 sticky top-0 z-40"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleMobileMenuOpen}
              className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search encrypted content..."
                className="bg-neutral-800/50 border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--secondary-color)]/50 w-64 lg:w-80"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard/notifications">
              <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </Link>

            <Button
              onClick={handleNewPostClick}
              className="bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-neutral-950 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Post</span>
            </Button>
          </div>
        </div>
      </motion.div>
    ),
    [handleMobileMenuOpen, handleNewPostClick]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex">
        {Sidebar}
        {MobileSidebar}

        <div className="flex-1">
          {Header}

          <main className="p-4 lg:p-6">
            {children}
          </main>
          
          {/* Post Composer Modal */}
          {PostComposer}
        </div>
      </div>

      <MediaUpload
        isOpen={showMediaUpload}
        onClose={() => setShowMediaUpload(false)}
        onMediaSelect={handleMediaSelect}
      />
    </div>
  );
}
