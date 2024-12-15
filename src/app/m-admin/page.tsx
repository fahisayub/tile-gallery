"use client";

import { useState } from "react";
import { Card, Image } from "@nextui-org/react";
import { Upload } from "lucide-react";

interface UploadedImage {
  id: string;
  url: string;
  deleteHash?: string;
}

export default function AdminPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
          id: data.data.id,
          url: data.data.link,
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
      const newImages = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
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

      {/* Image Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {uploadedImages.map((image) => (
            <Card 
              key={image.id} 
              className="relative group cursor-pointer overflow-hidden"
              isPressable
              onPress={() => navigator.clipboard.writeText(image.url)}
            >
              <div className="aspect-[3/4]">
                <Image
                  src={image.url}
                  alt="Uploaded image"
                  className="object-cover w-full h-full"
                  classNames={{
                    wrapper: "w-full h-full",
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <p className="text-white text-sm">Click to copy URL</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
