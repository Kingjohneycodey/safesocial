"use client";

import { useState, useCallback, memo, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Lock,
  Globe,
  MessageCircle,
  Share2,
  Heart,
  MoreHorizontal,
  Bookmark,
  Flag,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import DataVaultAbi from '../abis/DataVault.json';
import PostRegistryAbi from '../abis/PostRegistry.json';

interface PostCardProps {
  post: {
    id: number;
    author: string;
    owner: string; // Added owner field
    creatorName?: string; // Added creator name field
    content: string;
    timestamp: string;
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
    fileId?: string; // Added fileId to the interface
    price?: number; // Added price to the interface
  };
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
}

// Helper: Generate encrypted key - should use user's pub key and file key (for demo, returns dummy)
async function generateEncryptedKey(fileId: string, userAddress: string) {
  // TODO: Replace with your ECIES or wallet-based encryption. For now, dummy:
  return `encrypted-key-for-${fileId}-${userAddress}`;
}

// Helper: Check if file is an image based on IPFS URL
function isImageFile(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const isImage = imageExtensions.some(ext => url.toLowerCase().includes(ext));
  console.log('🖼️ Image detection:', { url, isImage });
  return isImage;
}

const PostCard = memo(function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: PostCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  // 🚀 New: getFile integration
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [fileAccessError, setFileAccessError] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const { data: walletClient } = useWalletClient();

  const handleFetchFile = useCallback(async () => {
    setIpfsUrl(null); setFileAccessError(null); setFileLoading(true);
    try {
      if (!walletClient || !post.fileId) throw new Error('Wallet not connected');
      
      console.log('🔍 Debug Info:');
      console.log('post.fileId:', post.fileId);
      console.log('post.price:', post.price);
      console.log('post.price type:', typeof post.price);
      console.log('post.isPublic:', post.isPublic);
      console.log('post.owner:', post.owner);
      console.log('post object keys:', Object.keys(post));
      console.log('post object:', post);
      console.log('walletClient.account.address:', walletClient.account.address);
      console.log('DATA_VAULT_ADDRESS:', process.env.NEXT_PUBLIC_DATA_VAULT_ADDRESS);
      console.log('POST_REGISTRY_ADDRESS:', process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS);
      
      if (!process.env.NEXT_PUBLIC_DATA_VAULT_ADDRESS) {
        throw new Error('DATA_VAULT_ADDRESS environment variable is not set');
      }
      if (!process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS) {
        throw new Error('POST_REGISTRY_ADDRESS environment variable is not set');
      }
      
      const ethers = (await import('ethers')).ethers;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(walletClient.account.address);
      const dataVault = new ethers.Contract(
        process.env.NEXT_PUBLIC_DATA_VAULT_ADDRESS!,
        DataVaultAbi.abi,
        signer
      );
      const postRegistry = new ethers.Contract(
        process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS!,
        PostRegistryAbi.abi,
        signer
      );
      
      console.log('dataVault contract created:', !!dataVault);
      console.log('postRegistry contract created:', !!postRegistry);
      
      // First check if user is the creator of the post (case-insensitive comparison)
      const isCreator = post.owner?.toLowerCase() === walletClient.account.address?.toLowerCase();
      console.log('👤 Is user the creator?', isCreator);
      console.log('👤 Post owner:', post.owner);
      console.log('👤 Post owner type:', typeof post.owner);
      console.log('👤 User address:', walletClient.account.address);
      console.log('👤 User address type:', typeof walletClient.account.address);
      console.log('👤 Address comparison (exact):', post.owner === walletClient.account.address);
      console.log('👤 Address comparison (lowercase):', post.owner?.toLowerCase() === walletClient.account.address?.toLowerCase());
      
      if (isCreator) {
        // Creator has automatic access
        console.log('✅ User is the creator, granting automatic access...');
        try {
          // First, let's check if the file exists in the DataVault
          console.log('🔍 Checking file info for creator...');
          const fileInfo = await dataVault.getFileInfo(post.fileId);
          console.log('📋 File info for creator:', fileInfo);
          
          if (fileInfo.ipfsHash && fileInfo.ipfsHash.length > 0) {
            console.log('✅ IPFS hash found:', fileInfo.ipfsHash);
            const fileUrl = `https://ipfs.io/ipfs/${fileInfo.ipfsHash}`;
            console.log('🔗 Setting file URL:', fileUrl);
            setIpfsUrl(fileUrl);
            const imageCheck = isImageFile(fileUrl);
            console.log('🖼️ Setting image state:', imageCheck);
            setIsImage(imageCheck);
            return;
          } else {
            console.log('❌ IPFS hash is empty in file info');
            setFileAccessError('File registered but IPFS hash is empty. Please check file registration.');
            return;
          }
        } catch (creatorErr: unknown) {
          console.log('❌ Creator access failed:', creatorErr instanceof Error ? creatorErr.message : String(creatorErr));
          console.log('❌ Error details:', creatorErr);
          
          // Try to get file info to debug
          try {
            console.log('🔍 Trying to get file info for debugging...');
            const fileInfo = await dataVault.getFileInfo(post.fileId);
            console.log('📋 File info (debug):', fileInfo);
          } catch (debugErr: unknown) {
            console.log('❌ Could not get file info:', debugErr instanceof Error ? debugErr.message : String(debugErr));
          }
          
          setFileAccessError('Failed to access your own file. Please check the file registration.');
          return;
        }
      }
      
      // For non-creators, check if they can access the post
      try {
        console.log('🔄 Checking if user can access post...');
        const canAccess = await postRegistry.canUserAccessPost(post.id, walletClient.account.address);
        console.log('✅ Can access post:', canAccess);
        
        if (canAccess) {
          // User has access, try to get the file info
          console.log('🔄 User has access, trying to get file info...');
          const fileInfo = await dataVault.getFileInfo(post.fileId);
          console.log('📋 File info for user with access:', fileInfo);
          
          if (fileInfo.ipfsHash && fileInfo.ipfsHash.length > 0) {
            console.log('✅ IPFS hash retrieved:', fileInfo.ipfsHash);
            const fileUrl = `https://ipfs.io/ipfs/${fileInfo.ipfsHash}`;
            console.log('🔗 Setting file URL (user access):', fileUrl);
            setIpfsUrl(fileUrl);
            const imageCheck = isImageFile(fileUrl);
            console.log('🖼️ Setting image state (user access):', imageCheck);
            setIsImage(imageCheck);
            return;
          } else {
            console.log('❌ IPFS hash is empty in file info');
            setFileAccessError('File registered but IPFS hash is empty. Please check file registration.');
            return;
          }
        }
      } catch (accessErr: unknown) {
        console.log('❌ Access check failed:', accessErr instanceof Error ? accessErr.message : String(accessErr));
      }
      
      // If user doesn't have access, check if it's a paid post
      if (post.price && Number(post.price) > 0 && !post.isPublic) {
        console.log('💰 This is a paid post, price:', post.price);
        console.log('💰 Price in wei:', post.price);
        console.log('💰 Price in ETH:', ethers.formatEther(post.price));
        setFileAccessError(`This post requires payment of ${ethers.formatEther(post.price)} ETH. Click "Pay to Access" to unlock.`);
        return;
      }
      
      // Debug the access conditions
      console.log('🔍 Access condition debug:');
      console.log('post.isPublic:', post.isPublic);
      console.log('post.price:', post.price, '(type:', typeof post.price, ')');
      console.log('Number(post.price):', Number(post.price));
      console.log('Number(post.price) === 0:', Number(post.price) === 0);
      console.log('!post.price:', !post.price);
      console.log('Number(post.price) === 0 || !post.price:', Number(post.price) === 0 || !post.price);
      console.log('post.isPublic || Number(post.price) === 0 || !post.price:', post.isPublic || Number(post.price) === 0 || !post.price);
      
      // For free posts (price = 0) or public posts, try to get file directly
      if (post.isPublic || Number(post.price) === 0 || !post.price) {
        try {
          console.log('🔄 Trying to get free/public file...');
          console.log('dataVault contract:', dataVault);
          console.log('dataVault.getFileInfo method:', dataVault?.getFileInfo);
          console.log('post.fileId:', post.fileId);
          
          if (!dataVault) {
            throw new Error('DataVault contract is not initialized');
          }
          if (!dataVault.getFileInfo) {
            throw new Error('getFileInfo method not found on DataVault contract');
          }
          
          // For free posts, use getFileInfo (view function) instead of getFile (state-changing)
          const fileInfo = await dataVault.getFileInfo(post.fileId);
          console.log('📋 File info for free post:', fileInfo);
          
          if (fileInfo.ipfsHash && fileInfo.ipfsHash.length > 0) {
            console.log('✅ IPFS hash retrieved:', fileInfo.ipfsHash);
            const fileUrl = `https://ipfs.io/ipfs/${fileInfo.ipfsHash}`;
            console.log('🔗 Setting file URL (free post):', fileUrl);
            setIpfsUrl(fileUrl);
            const imageCheck = isImageFile(fileUrl);
            console.log('🖼️ Setting image state (free post):', imageCheck);
            setIsImage(imageCheck);
          } else {
            console.log('❌ IPFS hash is empty in file info');
            setFileAccessError('File registered but IPFS hash is empty. Please check file registration.');
          }
        } catch (readErr: unknown) {
          console.log('❌ Free/public file access failed:', readErr instanceof Error ? readErr.message : String(readErr));
          console.log('❌ Error details:', readErr);
          setFileAccessError('Failed to access file. Please check if the file is properly registered.');
        }
      } else {
        // This is a private paid post that the user doesn't have access to
        console.log('🔒 Private paid post - user needs to pay for access');
        setFileAccessError('Access denied. You need to pay to access this content.');
      }
    } catch (err: unknown) {
      console.log('❌ Main error:', err instanceof Error ? err.message : String(err));
      setFileAccessError(err instanceof Error ? err.message : 'Access denied or failed');
    } finally {
      setFileLoading(false);
    }
  }, [walletClient, post]);
  
  const checkAccessAndFetchFile = useCallback(async () => {
    if (!walletClient || !post.fileId) return;
    
    try {
      const ethers = (await import('ethers')).ethers;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(walletClient.account.address);
      const postRegistry = new ethers.Contract(
        process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS!,
        PostRegistryAbi.abi,
        signer
      );
      
      // Check if user has access
      const canAccess = await postRegistry.canUserAccessPost(post.id, walletClient.account.address);
      const isCreator = post.owner?.toLowerCase() === walletClient.account.address?.toLowerCase();
      const isFreePost = Number(post.price) === 0 || !post.price;
      const isPublicPost = post.isPublic ? true : false;
      
      console.log('🔍 Auto-access check:', { canAccess, isCreator, isFreePost, isPublicPost, price: post.price });
      
      if (canAccess || isCreator || isFreePost || isPublicPost) {
        console.log('✅ User has access, auto-fetching file...');
        setHasAccess(true);
        // Auto-fetch the file
        await handleFetchFile();
      } else {
        console.log('❌ User does not have access');
      }
    } catch (err) {
      console.log('Auto-access check failed:', err);
    }
  }, [walletClient, post.fileId, post.id, post.owner, post.price, post.isPublic, handleFetchFile]);
  
  // Auto-check access and fetch file when component mounts
  useEffect(() => {
    if (walletClient?.account?.address && post.fileId) {
      checkAccessAndFetchFile();
    }
  }, [walletClient?.account?.address, post.fileId, checkAccessAndFetchFile]);
  


  const handlePayAndGrantAccess = async () => {
    setFileAccessError(null); setFileLoading(true);
    try {
      if (!walletClient || !post.fileId) throw new Error('Wallet not connected');
      
      console.log('💰 Starting payment process...');
      console.log('Post ID:', post.id);
      console.log('Post price:', post.price);
      console.log('User address:', walletClient.account.address);
      
      const ethers = (await import('ethers')).ethers;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(walletClient.account.address);
      const postRegistry = new ethers.Contract(
        process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS!,
        PostRegistryAbi.abi,
        signer
      );
      
      // Generate encrypted key (off-chain, for this user)
      const encryptedKey = await generateEncryptedKey(post.fileId, walletClient.account.address);
      console.log('🔑 Generated encrypted key:', encryptedKey);
      
      // Use the exact stored price - contract expects exact match
      const priceInWei = post.price;
      if (!priceInWei) throw new Error('Post price is undefined');
      console.log('💸 Using exact stored price (wei):', priceInWei.toString());
      console.log('💸 Price in ETH:', ethers.formatEther(priceInWei));
      
      // Pay AND grant access
      console.log('🔄 Sending payment transaction...');
      const tx = await postRegistry.payAndGrantAccess(
        post.id,
        encryptedKey,
        { value: priceInWei }
      );
      
      console.log('📝 Payment transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Payment confirmed:', receipt.status);
      
      // After payment, try to access the file
      console.log('🔄 Payment successful, now trying to access file...');
      setFileAccessError('Payment successful! Now click "View File" to access the content.');
      
    } catch (err: unknown) {
      console.log('❌ Payment failed:', err instanceof Error ? err.message : String(err));
      setFileAccessError(err instanceof Error ? err.message : 'Payment failed or transaction rejected');
    } finally {
      setFileLoading(false);
    }
  };

  const handleLike = useCallback(() => {
    onLike?.(post.id);
  }, [post.id, onLike]);

  const handleComment = useCallback(() => {
    onComment?.(post.id);
  }, [post.id, onComment]);

  const handleShare = useCallback(() => {
    onShare?.(post.id);
  }, [post.id, onShare]);

  const handleBookmark = useCallback(() => {
    onBookmark?.(post.id);
  }, [post.id, onBookmark]);

  const handleFollow = useCallback(() => {
    setIsFollowing(!isFollowing);
  }, [isFollowing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-200"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-neutral-950 font-bold">{post.creatorName?.slice(0, 2)}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">
                {post.creatorName || post.author || 'Anonymous'}
              </span>
              {post.isEncrypted && (
                <div className="flex items-center space-x-1 text-blue-400">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs">Encrypted</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-neutral-500 text-sm">
              <span className="text-xs font-mono">{post.owner?.slice(0, 6)}...{post.owner?.slice(-4)}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
              <span>•</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFollow}
            className={`text-xs ${
              isFollowing
                ? "bg-blue-400/20 text-blue-400 hover:bg-blue-400/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-3 h-3 mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3 mr-1" />
                Follow
              </>
            )}
          </Button>

          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-10 bg-neutral-800 border border-neutral-700 rounded-xl p-2 min-w-48 z-10">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-neutral-300 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Save Post</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-neutral-300 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share Post</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <Flag className="w-4 h-4" />
                  <span>Report Post</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-neutral-300 leading-relaxed">{post.content}</p>
      </div>

      {/* Show media inline if user has access */}
      {hasAccess && ipfsUrl && (
        <div className="mb-4">
    
            <Image
              src={ipfsUrl}
              alt="Post content"
              width={800}
              height={400}
              className={`w-full max-h-96 object-cover rounded-xl ${!isImage ? 'hidden' : ''}`}
              onLoad={() => {
                console.log('✅ Image loaded successfully');
                setIsImage(true);
              }}
              onError={() => {
                console.log('❌ Image failed to load - hiding image');
                setIsImage(false);
              }}
            />
      
          {/* IPFS link button below the media */}
          <div className="mt-2">
            <a 
              href={ipfsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              🔗 View on IPFS
            </a>
          </div>
        </div>
      )}

      {/* Add fileId logic after content */}
      {post.fileId && (
        <div className="mt-3">
          
          {/* Show payment button for paid posts (only for non-creators) */}
          {!hasAccess && post.price && Number(post.price) > 0 && post.owner?.toLowerCase() !== walletClient?.account?.address?.toLowerCase() && (
            <button
              onClick={handlePayAndGrantAccess}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 mr-4"
              disabled={fileLoading}
            >
              {fileLoading ? 'Processing Payment...' : `Pay ${ethers.formatEther(post.price)} ETH to Access`}
            </button>
          )}
          
          {/* Show view file button only if user doesn't have automatic access */}
          {!hasAccess && (
            <button
              onClick={handleFetchFile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={fileLoading}
            >
              {fileLoading ? 'Requesting File...' : 'View File'}
            </button>
          )}
          
          {/* Show IPFS link only if user doesn't have automatic access and it's not an image */}
          {!hasAccess && ipfsUrl && !isImage && (
            <a href={ipfsUrl} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-400 underline">
              Open File on IPFS
            </a>
          )}
          
          {/* Show error or success messages */}
          {fileAccessError && (
            <div className="mt-2 text-sm">
              {fileAccessError.includes('Payment successful') ? (
                <span className="text-green-400">{fileAccessError}</span>
              ) : (
                <span className="text-red-400">{fileAccessError}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4">
          {post.media.map((item, index) => (
            <div key={index} className="mb-2">
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={`Post media ${index}`}
                  width={800}
                  height={400}
                  className="w-full max-h-96 object-cover rounded-xl"
                />
              ) : (
                <video
                  src={item.url}
                  poster={item.thumbnail}
                  controls
                  className="w-full max-h-96 object-cover rounded-xl"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
        <div className="flex items-center space-x-4">
          <span>{post.likes} likes</span>
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              post.isLiked
                ? "text-blue-400"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`}
            />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            onClick={handleComment}
            className="flex items-center space-x-2 text-neutral-500 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-neutral-500 hover:text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 transition-colors ${
            post.isBookmarked
              ? "text-blue-400"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          <Bookmark
            className={`w-5 h-5 ${post.isBookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>
    </motion.div>
  );
});

export default PostCard;
