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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState("0x8a9b...2c4d");
  const [message, setMessage] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(true);

  const chats = [
    {
      id: "0x8a9b...2c4d",
      name: "Alex Chen",
      lastMessage: "Thanks for the encrypted file! 🔐",
      timestamp: "2m ago",
      unread: 2,
      isOnline: true,
      isEncrypted: true,
    },
    {
      id: "0x3f7e...9a1b",
      name: "Sarah Wilson",
      lastMessage: "Privacy is a fundamental right",
      timestamp: "1h ago",
      unread: 0,
      isOnline: false,
      isEncrypted: true,
    },
    {
      id: "0x5c2d...8f9a",
      name: "Mike Johnson",
      lastMessage: "Let's discuss the project details",
      timestamp: "3h ago",
      unread: 1,
      isOnline: true,
      isEncrypted: true,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "0x8a9b...2c4d",
      content: "Hey! I've encrypted the document you requested",
      timestamp: "2:30 PM",
      isEncrypted: true,
      isFromMe: false,
    },
    {
      id: 2,
      sender: "You",
      content:
        "Perfect! I can see it's properly encrypted. Thanks for using SafeSocial!",
      timestamp: "2:32 PM",
      isEncrypted: true,
      isFromMe: true,
    },
    {
      id: 3,
      sender: "0x8a9b...2c4d",
      content: "Thanks for the encrypted file! 🔐",
      timestamp: "2:35 PM",
      isEncrypted: true,
      isFromMe: false,
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
          <h1 className="text-xl font-bold text-white">Messages</h1>
        </div>

        <div className="relative mb-6">
          <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search encrypted messages..."
            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400/50"
          />
        </div>

        <div className="space-y-2">
          {chats.map((chat) => (
            <motion.button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 rounded-xl transition-all duration-200 text-left ${
                selectedChat === chat.id
                  ? "bg-blue-400/20 border border-blue-400/30"
                  : "hover:bg-neutral-800/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-neutral-950 font-bold text-sm">
                      {chat.name.charAt(0)}
                    </span>
                  </div>
                  {chat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-neutral-900"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-neutral-500">
                      {chat.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {chat.isEncrypted && (
                      <Lock className="w-3 h-3 text-blue-400" />
                    )}
                    <p className="text-sm text-neutral-400 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-neutral-950 font-bold">
                          {chat.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const ChatArea = () => (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-neutral-950 font-bold">A</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Alex Chen</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-blue-400">Online</span>
                <Lock className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400">Encrypted</span>
              </div>
            </div>
          </div>

          <button className="p-2 text-neutral-400 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.isFromMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.isFromMe
                    ? "bg-blue-400 text-neutral-950"
                    : "bg-neutral-800 text-white"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {msg.isEncrypted && <Lock className="w-3 h-3" />}
                  <span className="text-xs opacity-70">{msg.timestamp}</span>
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <div className="bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-neutral-400 hover:text-white transition-colors">
            <Image className="w-5 h-5" />
          </button>
          <button className="p-2 text-neutral-400 hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type an encrypted message..."
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400/50"
              onKeyPress={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  // Handle message send
                  setMessage("");
                }
              }}
            />
          </div>

          <button
            onClick={() => setIsEncrypted(!isEncrypted)}
            className={`p-2 rounded-lg transition-colors ${
              isEncrypted
                ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                : "bg-red-400/20 text-red-400 border border-red-400/30"
            }`}
          >
            {isEncrypted ? (
              <Lock className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          <Button
            onClick={() => {
              if (message.trim()) {
                // Handle message send
                setMessage("");
              }
            }}
            className="bg-blue-400 hover:bg-blue-500 text-neutral-950 font-semibold"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
