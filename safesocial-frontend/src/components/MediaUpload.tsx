"use client";

import { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Video,
  Music,
  Camera,
  X,
  Upload,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaUploadProps {
  onMediaSelect: (media: File[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

const MediaUpload = memo(function MediaUpload({
  onMediaSelect,
  onClose,
  isOpen,
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    console.log("📁 Processing files:", files);
    files.forEach(file => {
      console.log(`📄 File details:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
    });
    
    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
      ];
      const isValid = validTypes.includes(file.type);
      console.log(`✅ File ${file.name} (${file.type}) is valid:`, isValid);
      return isValid;
    });

    console.log("🎯 Valid files after filtering:", validFiles);

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);

      // Create preview URLs
      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("File input changed:", e.target.files);
      if (e.target.files) {
        handleFiles(Array.from(e.target.files));
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onMediaSelect(selectedFiles);
    setSelectedFiles([]);
    setPreviewUrls([]);
    onClose();
  }, [selectedFiles, onMediaSelect, onClose]);

  const mediaTypes = [
    { type: "image", icon: Image, label: "Photos", accept: "image/*" },
    { type: "video", icon: Video, label: "Videos", accept: "video/*" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add Media</h2>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {selectedFiles.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-400 bg-blue-400/10"
                    : "border-neutral-700 hover:border-neutral-600"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Drag & drop media here
                </h3>
                <p className="text-neutral-400 mb-6">
                  or click the buttons below to select files
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {mediaTypes.map((media) => {
                    const Icon = media.icon;
                    return (
                      <button
                        key={media.type}
                        onClick={() => {
                          if (media.type === "image") {
                            console.log("Opening image file picker");
                            fileInputRef.current?.click();
                          } else if (media.type === "video") {
                            console.log("Opening video file picker");
                            videoInputRef.current?.click();
                          }
                        }}
                        className="flex items-center space-x-3 p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors"
                      >
                        <Icon className="w-6 h-6 text-blue-400" />
                        <span className="text-white font-medium">
                          {media.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Selected Media ({selectedFiles.length})
                </h3>

                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-neutral-800 rounded-xl overflow-hidden">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={previewUrls[index]}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        ) : file.type.startsWith("video/") ? (
                          <div className="w-full h-full relative">
                            <video
                              src={previewUrls[index]}
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                              playsInline
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
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-8 h-8 text-blue-400" />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>

                      <div className="mt-2">
                        <p className="text-sm text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFiles([]);
                      setPreviewUrls([]);
                    }}
                    className="border-neutral-700 text-neutral-400 hover:text-white"
                  >
                    Clear All
                  </Button>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-neutral-700 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="bg-blue-400 hover:bg-blue-500 text-neutral-950 font-semibold"
                    >
                      Add to Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default MediaUpload;
