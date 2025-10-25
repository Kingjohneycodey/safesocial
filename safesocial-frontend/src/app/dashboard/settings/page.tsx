"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  MessageCircle,
  Settings as SettingsIcon,
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
  Smartphone,
  Monitor,
  Wifi,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("privacy");
  const [notifications, setNotifications] = useState({
    messages: true,
    mentions: true,
    likes: false,
    shares: true,
    security: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "followers",
    messageRequests: "followers",
    dataSharing: false,
    analytics: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const settingsSections = [
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "account", label: "Account", icon: User },
    { id: "data", label: "Data & Storage", icon: Database },
    { id: "advanced", label: "Advanced", icon: SettingsIcon },
  ];

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage for demo
      localStorage.setItem(
        "safesocial-settings",
        JSON.stringify({
          notifications,
          privacy,
          timestamp: new Date().toISOString(),
        })
      );

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = {
        settings: { notifications, privacy },
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `safesocial-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

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
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>

        <nav className="space-y-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Security Status
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            All settings are end-to-end encrypted
          </p>
        </div>
      </div>
    </motion.div>
  );

  const PrivacySettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          Privacy & Security
        </h2>

        <div className="space-y-6">
          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Profile Visibility
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={privacy.profileVisibility === "public"}
                  onChange={(e) =>
                    setPrivacy({
                      ...privacy,
                      profileVisibility: e.target.value,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 focus:ring-blue-400"
                />
                <span className="text-white">
                  Public - Anyone can see your profile
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="followers"
                  checked={privacy.profileVisibility === "followers"}
                  onChange={(e) =>
                    setPrivacy({
                      ...privacy,
                      profileVisibility: e.target.value,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 focus:ring-blue-400"
                />
                <span className="text-white">
                  Followers only - Only your followers can see your profile
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={privacy.profileVisibility === "private"}
                  onChange={(e) =>
                    setPrivacy({
                      ...privacy,
                      profileVisibility: e.target.value,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 focus:ring-blue-400"
                />
                <span className="text-white">
                  Private - Only you can see your profile
                </span>
              </label>
            </div>
          </div>

          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Message Requests
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="messageRequests"
                  value="everyone"
                  checked={privacy.messageRequests === "everyone"}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, messageRequests: e.target.value })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 focus:ring-blue-400"
                />
                <span className="text-white">
                  Everyone - Anyone can message you
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="messageRequests"
                  value="followers"
                  checked={privacy.messageRequests === "followers"}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, messageRequests: e.target.value })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 focus:ring-blue-400"
                />
                <span className="text-white">
                  Followers only - Only your followers can message you
                </span>
              </label>
            </div>
          </div>

          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Data Protection
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Data Sharing</span>
                  <p className="text-sm text-neutral-400">
                    Allow sharing of anonymized data for research
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.dataSharing}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, dataSharing: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-400"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Analytics</span>
                  <p className="text-sm text-neutral-400">
                    Allow collection of usage analytics
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.analytics}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, analytics: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-400"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>

        <div className="space-y-6">
          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Message Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">New Messages</span>
                  <p className="text-sm text-neutral-400">
                    Get notified when you receive new messages
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.messages}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      messages: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-400"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Mentions</span>
                  <p className="text-sm text-neutral-400">
                    Get notified when someone mentions you
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.mentions}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      mentions: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-400"
                />
              </label>
            </div>
          </div>

          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Engagement
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Likes</span>
                  <p className="text-sm text-neutral-400">
                    Get notified when someone likes your posts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.likes}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      likes: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-400"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Shares</span>
                  <p className="text-sm text-neutral-400">
                    Get notified when someone shares your posts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.shares}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      shares: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-400"
                />
              </label>
            </div>
          </div>

          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">
                    Security Alerts
                  </span>
                  <p className="text-sm text-neutral-400">
                    Get notified about security events
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.security}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      security: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-400 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-400"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DataSettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Data & Storage</h2>

        <div className="space-y-6">
          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Data Management
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-white font-medium">Export Data</span>
                    <p className="text-sm text-neutral-400">
                      Download all your encrypted data
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:text-white"
                >
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-white font-medium">Import Data</span>
                    <p className="text-sm text-neutral-400">
                      Import data from another SafeSocial account
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:text-white"
                >
                  Import
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Storage</h3>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Used Storage</span>
                  <span className="text-blue-400">2.3 GB / 10 GB</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: "23%" }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-400/10 border border-red-400/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <div>
                    <span className="text-red-400 font-medium">
                      Delete All Data
                    </span>
                    <p className="text-sm text-neutral-400">
                      Permanently delete all your data
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "privacy":
        return <PrivacySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "data":
        return <DataSettings />;
      default:
        return <PrivacySettings />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>

            {/* Save Button and Status */}
            <div className="mt-8 p-6 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {saveStatus === "saving" && (
                    <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                  )}
                  {saveStatus === "saved" && (
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  )}
                  {saveStatus === "error" && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white font-medium">
                    {saveStatus === "saving" && "Saving settings..."}
                    {saveStatus === "saved" && "Settings saved successfully!"}
                    {saveStatus === "error" && "Failed to save settings"}
                    {saveStatus === "idle" &&
                      "Settings are encrypted and secure"}
                  </span>
                </div>

                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-blue-400 hover:bg-blue-500 text-neutral-950 font-semibold disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
