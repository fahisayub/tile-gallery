# Home Page Customization System Documentation

## Overview

I have successfully implemented a comprehensive home page customization system that allows complete control over the website's home page content from the m-admin page. The system includes:

- **Pinned Images Management** - Control the card deck carousel images
- **Contact Details Management** - Update company information and contact details
- **About Us Customization** - Modify about section content
- **Collection Categories Management** - Add/remove/modify collection categories
- **Custom Sections** - Add new sections like services, features, testimonials, etc.

## Key Features Implemented

### 1. Database Schema (HomePageSettings Model)

Created a comprehensive MongoDB schema (`src/models/HomePageSettings.ts`) that stores:

```typescript
interface HomePageSettings {
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
    pinnedImages: [ObjectId]; // References to Image documents
  };
  collectionCategories: [{
    id: string;
    name: string;
    label: string;
    description: string;
    isEnabled: boolean;
    order: number;
  }];
  customSections: [{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    type: 'services' | 'features' | 'testimonials' | 'gallery' | 'custom';
    isEnabled: boolean;
    order: number;
    content: Mixed; // Flexible content structure
    images: [string]; // Array of image URLs
  }];
}
```

### 2. API Endpoints

Created comprehensive API endpoints (`src/app/api/homepage-settings/route.ts`):

- **GET /api/homepage-settings** - Retrieve current settings
- **PUT /api/homepage-settings** - Update all settings
- **POST /api/homepage-settings** - Handle specific actions:
  - `add-custom-section`
  - `update-custom-section`
  - `remove-custom-section`
  - `reorder-sections`
  - `update-pinned-images`

### 3. Enhanced Admin Interface

Completely redesigned the m-admin page (`src/app/m-admin/page.tsx`) with tabbed interface:

#### Tab 1: Images Management
- Upload new images
- View pinned, today's uploads, and all images
- Pin/unpin images for the card deck (max 10)
- Add images to collections

#### Tab 2: Home Page Settings
- **Hero Section Configuration:**
  - Customize hero title and subtitle
  - Modify button text and links
  - Visual preview of pinned images for card deck

#### Tab 3: Contact & About
- **Contact Details:**
  - Company name, phone, address
  - Working hours, Google Maps URL
- **About Us Section:**
  - Section title and description
  - Company logo URL

#### Tab 4: Collections
- **Category Management:**
  - Enable/disable categories
  - Add new categories
  - Rename existing categories
  - Delete categories

#### Tab 5: Custom Sections
- **Add New Sections:**
  - Choose from predefined types (Services, Features, Testimonials, Gallery, Custom)
  - Set title, subtitle, and description
- **Manage Existing Sections:**
  - Enable/disable sections
  - Delete sections
  - View section details

### 4. Dynamic Frontend Components

#### Updated HeroSection (`src/components/HeroSection.tsx`)
- Fetches dynamic content from homepage settings
- Uses dynamic title, subtitle, and button text
- Fallbacks to default content if API fails

#### Updated CardDeckSection (`src/components/CardDeckSection/CardDeckSection.tsx`)
- Loads pinned images from database
- Dynamic image carousel with fallback to static images
- Displays custom titles for each image

#### Updated AboutSection (`src/components/AboutSection.tsx`)
- Dynamic title, description, and company logo
- Maintains existing stats and layout
- Graceful fallbacks to default content

#### Updated Footer (`src/components/Footer.tsx`)
- Dynamic contact details
- Phone numbers, address, working hours
- Dynamic company name with proper styling

#### Updated ProjectsSection (`src/components/ProjectsSection/index.tsx`)
- Loads collection categories from database
- Dynamic category filtering
- Maintains existing project grid functionality

#### New CustomSection Component (`src/components/CustomSection.tsx`)
Renders different types of custom sections:

- **Services:** Icon-based service listings
- **Features:** Feature cards with emojis
- **Testimonials:** Customer review cards with ratings
- **Gallery:** Image grid with hover effects
- **Custom:** HTML content support

### 5. Updated Home Page (`src/app/page.tsx`)
- Server-side data fetching for settings
- Dynamic rendering of custom sections
- Maintains existing sections (Hero, Projects, About)
- Proper ordering of custom sections

## How to Use

### For Administrators:

1. **Access Admin Panel:**
   - Navigate to `/m-admin`
   - Use the tabbed interface to manage different aspects

2. **Manage Images:**
   - Upload images in the Images tab
   - Pin up to 10 images for the card deck
   - Organize images into collections

3. **Customize Hero Section:**
   - Update titles, subtitles, and button text in Home Page tab
   - Preview pinned images

4. **Update Contact Information:**
   - Modify company details in Contact & About tab
   - Update about section content

5. **Manage Collections:**
   - Add/remove categories in Collections tab
   - Enable/disable categories as needed

6. **Add Custom Sections:**
   - Create new sections in Custom Sections tab
   - Choose appropriate section types
   - Enable/disable sections dynamically

### For Developers:

1. **Database Setup:**
   - Ensure MongoDB connection is properly configured
   - The system auto-creates default settings on first access

2. **Environment Variables:**
   - Set `MONGODB_URI` for database connection
   - Configure production domain for SSR data fetching

3. **Extending Custom Sections:**
   - Add new section types in `CustomSection.tsx`
   - Extend the schema in `HomePageSettings.ts`
   - Update admin interface for new section types

## Benefits

1. **Complete Customization:** Every aspect of the home page can be customized without code changes
2. **User-Friendly Interface:** Intuitive admin panel with organized tabs
3. **Real-Time Updates:** Changes reflect immediately on the website
4. **Flexible Content:** Support for various content types and custom sections
5. **Fallback Safety:** Graceful degradation if database is unavailable
6. **Scalable Architecture:** Easy to extend with new features and section types

## Technical Highlights

- **Type Safety:** Full TypeScript implementation with proper interfaces
- **Performance:** Efficient data fetching with caching and SSR
- **Responsive Design:** Admin interface works on all devices
- **Error Handling:** Comprehensive error handling with user feedback
- **Data Validation:** Proper validation for all inputs and settings
- **Security:** Secure API endpoints with proper error handling

## Future Enhancements

Potential areas for expansion:
- Drag-and-drop section reordering
- Rich text editor for custom content
- Image management with crop/resize features
- Template system for different page layouts
- Multi-language support
- SEO meta tags management
- Advanced analytics integration

This system provides a robust foundation for complete home page customization while maintaining excellent user experience and developer-friendly architecture.