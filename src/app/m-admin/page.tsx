"use client";

import { useState, useEffect } from "react";
import { Card } from "@nextui-org/card";
import { Image as NextUIImage } from "@nextui-org/image";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/textarea";
import { Checkbox } from "@nextui-org/checkbox";
import { Select, SelectItem } from "@nextui-org/select";
import { Upload, Pin, PinOff, Tag, Plus, Share, Save, Phone, Edit, Trash2, Settings, Home, Info, Grid, Users } from "lucide-react";
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

interface HomePageSettings {
  _id?: string;
  contactDetails: {
    phone: string;
    address: string;
    mapUrl: string;
    workingHours: string;
    companyName: string;
  };
  aboutUs: {
    title: string;
    description: string;
    companyLogo: string;
  };
  heroSection: {
    title: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    pinnedImages: UploadedImage[];
  };
  collectionCategories: Array<{
    id: string;
    name: string;
    label: string;
    description?: string;
    isEnabled: boolean;
    order: number;
  }>;
  customSections: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    type: 'services' | 'features' | 'testimonials' | 'gallery' | 'custom';
    isEnabled: boolean;
    order: number;
    content?: any;
    images?: string[];
  }>;
}

export default function AdminPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [pinnedImages, setPinnedImages] = useState<UploadedImage[]>([]);
  const [todayImages, setTodayImages] = useState<UploadedImage[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [homePageSettings, setHomePageSettings] = useState<HomePageSettings | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("images");
  const [newCollection, setNewCollection] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states for home page customization
  const [newCustomSection, setNewCustomSection] = useState({
    title: '',
    subtitle: '',
    description: '',
    type: 'services' as const
  });

  useEffect(() => {
    fetchImages();
    fetchCollections();
    fetchHomePageSettings();
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

  const fetchHomePageSettings = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      const data = await response.json();
      if (data.success) {
        setHomePageSettings(data.settings);
      }
    } catch {
      toast.error("Failed to fetch homepage settings");
    }
  };

  const updateHomePageSettings = async (updates: Partial<HomePageSettings>) => {
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (data.success) {
        setHomePageSettings(data.settings);
        toast.success("Settings updated successfully");
      }
    } catch {
      toast.error("Failed to update settings");
    }
  };

  const addCustomSection = async () => {
    if (!newCustomSection.title.trim()) return;
    
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-custom-section',
          ...newCustomSection
        })
      });
      const data = await response.json();
      if (data.success) {
        setHomePageSettings(data.settings);
        setNewCustomSection({ title: '', subtitle: '', description: '', type: 'services' });
        toast.success("Custom section added");
      }
    } catch {
      toast.error("Failed to add custom section");
    }
  };

  const removeCustomSection = async (sectionId: string) => {
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove-custom-section',
          id: sectionId
        })
      });
      const data = await response.json();
      if (data.success) {
        setHomePageSettings(data.settings);
        toast.success("Custom section removed");
      }
    } catch {
      toast.error("Failed to remove custom section");
    }
  };

  const updatePinnedImages = async (imageIds: string[]) => {
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-pinned-images',
          imageIds
        })
      });
      const data = await response.json();
      if (data.success) {
        setHomePageSettings(data.settings);
        toast.success("Pinned images updated");
      }
    } catch {
      toast.error("Failed to update pinned images");
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

  if (!homePageSettings) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your website content and settings</p>
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="w-full"
      >
        {/* Images Management Tab */}
        <Tab key="images" title={
          <div className="flex items-center gap-2">
            <Upload size={16} />
            Images
          </div>
        }>
          {/* Upload Section */}
          <Card className="p-6 text-center relative mb-6">
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

          {/* Image Tabs */}
          <Tabs>
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
        </Tab>

        {/* Home Page Settings Tab */}
        <Tab key="homepage" title={
          <div className="flex items-center gap-2">
            <Home size={16} />
            Home Page
          </div>
        }>
          <div className="space-y-6">
            {/* Hero Section Settings */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings size={20} />
                Hero Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Hero Title"
                  value={homePageSettings.heroSection.title}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    heroSection: {
                      ...homePageSettings.heroSection,
                      title: e.target.value
                    }
                  })}
                />
                <Input
                  label="Primary Button Text"
                  value={homePageSettings.heroSection.primaryButtonText}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    heroSection: {
                      ...homePageSettings.heroSection,
                      primaryButtonText: e.target.value
                    }
                  })}
                />
                <Textarea
                  label="Hero Subtitle"
                  value={homePageSettings.heroSection.subtitle}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    heroSection: {
                      ...homePageSettings.heroSection,
                      subtitle: e.target.value
                    }
                  })}
                  className="md:col-span-2"
                />
              </div>
              <Button 
                color="primary" 
                className="mt-4"
                onClick={() => updateHomePageSettings(homePageSettings)}
              >
                Update Hero Section
              </Button>
            </Card>

            {/* Pinned Images for Card Deck */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Card Deck Images</h3>
              <p className="text-gray-600 mb-4">Select up to 10 images for the hero card deck:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {pinnedImages.map((image) => (
                  <Card key={image._id} className="relative group">
                    <div className="aspect-square">
                      <NextUIImage
                        src={image.url}
                        alt="Pinned image"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          onClick={() => handlePin(image._id, true)}
                        >
                          <PinOff size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {pinnedImages.length < 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Pin more images from the Images tab to add them to the card deck.
                </p>
              )}
            </Card>
          </div>
        </Tab>

        {/* Contact & About Tab */}
        <Tab key="content" title={
          <div className="flex items-center gap-2">
            <Info size={16} />
            Contact & About
          </div>
        }>
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Phone size={20} />
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={homePageSettings.contactDetails.companyName}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    contactDetails: {
                      ...homePageSettings.contactDetails,
                      companyName: e.target.value
                    }
                  })}
                />
                <Input
                  label="Phone Number"
                  value={homePageSettings.contactDetails.phone}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    contactDetails: {
                      ...homePageSettings.contactDetails,
                      phone: e.target.value
                    }
                  })}
                />
                <Input
                  label="Working Hours"
                  value={homePageSettings.contactDetails.workingHours}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    contactDetails: {
                      ...homePageSettings.contactDetails,
                      workingHours: e.target.value
                    }
                  })}
                />
                <Input
                  label="Google Maps URL"
                  value={homePageSettings.contactDetails.mapUrl}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    contactDetails: {
                      ...homePageSettings.contactDetails,
                      mapUrl: e.target.value
                    }
                  })}
                />
                <Textarea
                  label="Address"
                  value={homePageSettings.contactDetails.address}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    contactDetails: {
                      ...homePageSettings.contactDetails,
                      address: e.target.value
                    }
                  })}
                  className="md:col-span-2"
                />
              </div>
              <Button 
                color="primary" 
                className="mt-4"
                onClick={() => updateHomePageSettings(homePageSettings)}
              >
                Update Contact Details
              </Button>
            </Card>

            {/* About Us */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info size={20} />
                About Us
              </h3>
              <div className="space-y-4">
                <Input
                  label="About Section Title"
                  value={homePageSettings.aboutUs.title}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    aboutUs: {
                      ...homePageSettings.aboutUs,
                      title: e.target.value
                    }
                  })}
                />
                <Textarea
                  label="About Description"
                  value={homePageSettings.aboutUs.description}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    aboutUs: {
                      ...homePageSettings.aboutUs,
                      description: e.target.value
                    }
                  })}
                  rows={6}
                />
                <Input
                  label="Company Logo URL"
                  value={homePageSettings.aboutUs.companyLogo}
                  onChange={(e) => setHomePageSettings({
                    ...homePageSettings,
                    aboutUs: {
                      ...homePageSettings.aboutUs,
                      companyLogo: e.target.value
                    }
                  })}
                />
              </div>
              <Button 
                color="primary" 
                className="mt-4"
                onClick={() => updateHomePageSettings(homePageSettings)}
              >
                Update About Section
              </Button>
            </Card>
          </div>
        </Tab>

        {/* Collections Tab */}
        <Tab key="collections" title={
          <div className="flex items-center gap-2">
            <Grid size={16} />
            Collections
          </div>
        }>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Collection Categories</h3>
              <div className="space-y-4">
                {homePageSettings.collectionCategories.map((category, index) => (
                  <div key={category.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Checkbox
                      isSelected={category.isEnabled}
                      onChange={(isSelected) => {
                        const updatedCategories = [...homePageSettings.collectionCategories];
                        updatedCategories[index].isEnabled = isSelected;
                        setHomePageSettings({
                          ...homePageSettings,
                          collectionCategories: updatedCategories
                        });
                      }}
                    />
                    <div className="flex-1">
                      <Input
                        value={category.name}
                        onChange={(e) => {
                          const updatedCategories = [...homePageSettings.collectionCategories];
                          updatedCategories[index].name = e.target.value;
                          updatedCategories[index].label = e.target.value;
                          setHomePageSettings({
                            ...homePageSettings,
                            collectionCategories: updatedCategories
                          });
                        }}
                        size="sm"
                      />
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      onClick={() => {
                        const updatedCategories = homePageSettings.collectionCategories.filter(
                          (_, i) => i !== index
                        );
                        setHomePageSettings({
                          ...homePageSettings,
                          collectionCategories: updatedCategories
                        });
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="New category name"
                  size="sm"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const newCategory = {
                        id: `category-${Date.now()}`,
                        name: (e.target as HTMLInputElement).value,
                        label: (e.target as HTMLInputElement).value,
                        isEnabled: true,
                        order: homePageSettings.collectionCategories.length
                      };
                      setHomePageSettings({
                        ...homePageSettings,
                        collectionCategories: [...homePageSettings.collectionCategories, newCategory]
                      });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button color="primary">Add Category</Button>
              </div>
              
              <Button 
                color="primary" 
                className="mt-4"
                onClick={() => updateHomePageSettings(homePageSettings)}
              >
                Update Categories
              </Button>
            </Card>
          </div>
        </Tab>

        {/* Custom Sections Tab */}
        <Tab key="sections" title={
          <div className="flex items-center gap-2">
            <Users size={16} />
            Custom Sections
          </div>
        }>
          <div className="space-y-6">
            {/* Add New Section */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Add New Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Section Title"
                  value={newCustomSection.title}
                  onChange={(e) => setNewCustomSection({
                    ...newCustomSection,
                    title: e.target.value
                  })}
                />
                <Input
                  label="Section Subtitle"
                  value={newCustomSection.subtitle}
                  onChange={(e) => setNewCustomSection({
                    ...newCustomSection,
                    subtitle: e.target.value
                  })}
                />
                <Select
                  label="Section Type"
                  selectedKeys={[newCustomSection.type]}
                  onChange={(keys) => setNewCustomSection({
                    ...newCustomSection,
                    type: Array.from(keys)[0] as any
                  })}
                >
                  <SelectItem key="services">Our Services</SelectItem>
                  <SelectItem key="features">Features</SelectItem>
                  <SelectItem key="testimonials">Testimonials</SelectItem>
                  <SelectItem key="gallery">Gallery</SelectItem>
                  <SelectItem key="custom">Custom</SelectItem>
                </Select>
                <div></div>
                <Textarea
                  label="Section Description"
                  value={newCustomSection.description}
                  onChange={(e) => setNewCustomSection({
                    ...newCustomSection,
                    description: e.target.value
                  })}
                  className="md:col-span-2"
                />
              </div>
              <Button 
                color="primary" 
                className="mt-4"
                onClick={addCustomSection}
                disabled={!newCustomSection.title.trim()}
              >
                Add Section
              </Button>
            </Card>

            {/* Existing Sections */}
            {homePageSettings.customSections.map((section) => (
              <Card key={section.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">{section.title}</h4>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={section.isEnabled}
                      onChange={(isSelected) => {
                        const updatedSections = homePageSettings.customSections.map(s =>
                          s.id === section.id ? { ...s, isEnabled: isSelected } : s
                        );
                        setHomePageSettings({
                          ...homePageSettings,
                          customSections: updatedSections
                        });
                      }}
                    >
                      Enabled
                    </Checkbox>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      onClick={() => removeCustomSection(section.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Type: {section.type}</p>
                  {section.subtitle && <p className="text-sm">{section.subtitle}</p>}
                  {section.description && <p className="text-sm text-gray-700">{section.description}</p>}
                </div>
              </Card>
            ))}

            {homePageSettings.customSections.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No custom sections added yet. Add one above to get started.</p>
              </Card>
            )}
          </div>
        </Tab>
      </Tabs>
      
      <Toaster position="bottom-right" />
    </div>
  );
}
