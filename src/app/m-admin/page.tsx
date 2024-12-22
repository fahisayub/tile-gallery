"use client";

import { useState, useEffect } from "react";
import { Card } from "@nextui-org/card";
import { Image as NextUIImage } from "@nextui-org/image";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Input } from "@nextui-org/input";
import { Upload, Pin, PinOff, Tag, Plus, Share, Save, Phone } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface UploadedImage {
  _id: string;
  imgurId: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  isPinned: boolean;
  saveCount: number;
  shareCount: number;
  contactCount: number;
  createdAt: string;
  deleteHash?: string;
}

interface Collection {
  _id: string;
  name: string;
}

export default function AdminPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [pinnedImages, setPinnedImages] = useState<UploadedImage[]>([]);
  const [todayImages, setTodayImages] = useState<UploadedImage[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("pinned");
  const [newCollection, setNewCollection] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
    fetchCollections();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/images');
      const data = await response.json();

      if (data.success) {
        const today = new Date().toISOString().split('T')[0];

        setUploadedImages(data.images);
        setPinnedImages(data.images.filter((img: UploadedImage) => img.isPinned));
        setTodayImages(data.images.filter((img: UploadedImage) =>
          new Date(img.createdAt).toISOString().split('T')[0] === today
        ));
      } else {
        toast.error("Failed to fetch images");
      }
    } catch {
      toast.error("Failed to fetch images");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data.collections);
    } catch {
      toast.error("Failed to fetch collections");
    }
  };

  const uploadToImgur = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/imgur", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      if (data.success) {
        return {
          _id: data.data._id,
          imgurId: data.data.id,
          url: data.data.link,
          title: '',
          description: '',
          tags: ['all'],
          isPinned: false,
          saveCount: 0,
          shareCount: 0,
          contactCount: 0,
          createdAt: new Date().toISOString(),
          deleteHash: data.data.deletehash,
        };
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB`);
        }

        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }
      }

      const uploadPromises = Array.from(files).map(file => uploadToImgur(file));
      await Promise.all(uploadPromises);

      await fetchImages();

      toast.success('Images uploaded successfully');

      setActiveTab('today');
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handlePin = async (imageId: string, isPinned: boolean) => {
    if (isPinned && pinnedImages.length >= 10) {
      toast.error("Maximum 10 images can be pinned");
      return;
    }

    try {
      await fetch(`/api/images/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !isPinned })
      });
      await fetchImages();
      toast.success(isPinned ? "Image unpinned" : "Image pinned");
    } catch {
      toast.error("Failed to update pin status");
    }
  };

  const handleAddToCollection = async (imageId: string, collectionName: string) => {
    try {
      await fetch(`/api/images/${imageId}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionName })
      });
      await fetchImages();
      toast.success("Added to collection");
    } catch {
      toast.error("Failed to add to collection");
    }
  };

  const createCollection = async () => {
    if (!newCollection.trim()) return;

    try {
      await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollection })
      });
      await fetchCollections();
      setNewCollection("");
      toast.success("Collection created");
    } catch {
      toast.error("Failed to create collection");
    }
  };

  const renderImageGrid = (images: UploadedImage[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="aspect-[3/4] animate-pulse bg-gray-700" />
          ))}
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div className="text-center py-10 text-gray-400">
          No images found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image) => (
          <Card key={image._id} className="relative group">
            <div className="aspect-[3/4]">
              <NextUIImage
                src={image.url}
                alt={image.title || "Uploaded image"}
                className="object-cover w-full h-full"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => handlePin(image._id, image.isPinned)}
                  >
                    {image.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                  </Button>

                  <Popover>
                    <PopoverTrigger>
                      <Button isIconOnly size="sm">
                        <Tag size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="p-4 w-64">
                        <div className="mb-4">
                          <Input
                            size="sm"
                            placeholder="New collection"
                            value={newCollection}
                            onChange={(e) => setNewCollection(e.target.value)}
                            endContent={
                              <Button size="sm" onClick={createCollection}>
                                <Plus size={16} />
                              </Button>
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          {collections.map((collection) => (
                            <Button
                              key={collection._id}
                              size="sm"
                              variant="flat"
                              className="w-full justify-start"
                              onClick={() => handleAddToCollection(image._id, collection.name)}
                            >
                              {collection.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Stats */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-white">
                  <span><Save size={12} className="inline" /> {image.saveCount}</span>
                  <span><Share size={12} className="inline" /> {image.shareCount}</span>
                  <span><Phone size={12} className="inline" /> {image.contactCount}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Section */}
      <Card className="p-6 text-center relative">
        <div className="flex items-center justify-center w-full">
          <label className={`
            flex flex-col items-center justify-center w-full h-48 
            border-2 border-dashed rounded-lg cursor-pointer 
            hover:bg-gray-700 bg-gray-800 border-gray-600 
            hover:border-gray-500 transition-all duration-200
            ${isUploading ? 'opacity-50' : ''}
          `}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-8 h-8 mb-4 text-gray-400 ${isUploading ? 'animate-bounce' : ''}`} />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </span>
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
      >
        <Tab key="pinned" title="Pinned Images">
          {renderImageGrid(pinnedImages)}
        </Tab>

        {todayImages.length > 0 && (
          <Tab key="today" title="Today's Uploads">
            {renderImageGrid(todayImages)}
          </Tab>
        )}

        <Tab key="all" title="All Images">
          {renderImageGrid(uploadedImages)}
        </Tab>
      </Tabs>
      <Toaster position="bottom-right" />
    </div>
  );
}
