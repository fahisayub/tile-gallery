import mongoose from 'mongoose';

const ContactDetailsSchema = new mongoose.Schema({
    phone: { type: String, default: '+91 9961206232' },
    address: { type: String, default: 'Mukalel Paving Stone & Tiles, Near Jamaath Hall, Pallarimangalam, Kothamangalam, Kerala 686671' },
    mapUrl: { type: String, default: 'https://maps.app.goo.gl/B7RSb6ifDFCisbi98' },
    workingHours: { type: String, default: 'Mon-Sat: 9AM-7PM' },
    companyName: { type: String, default: 'Mukalel Paving Stone & Tiles' }
});

const AboutUsSchema = new mongoose.Schema({
    title: { type: String, default: 'About Us' },
    description: { type: String, default: 'Mukalel Paving Stone & Tiles has been a trusted name in premium natural stones and tiles. Based in Pallarimangalam, Kothamangalam, we offer an extensive collection of high-quality materials and expert installation services.' },
    companyLogo: { type: String, default: '/nobglogo.png' },
    stats: [{
        icon: String,
        value: String,
        label: String,
        color: String
    }]
});

const CustomSectionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    type: { type: String, enum: ['services', 'features', 'testimonials', 'gallery', 'custom'], required: true },
    isEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    content: mongoose.Schema.Types.Mixed, // Flexible content structure
    images: [String] // Array of image URLs
});

const CollectionCategorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    description: String,
    isEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
});

const HeroSectionSchema = new mongoose.Schema({
    title: { type: String, default: 'Premium Natural Stone & Tiles' },
    subtitle: { type: String, default: 'Transform your space with our exquisite collection of natural stones and premium tiles' },
    primaryButtonText: { type: String, default: 'View Collections' },
    primaryButtonLink: { type: String, default: '#collections' },
    secondaryButtonText: { type: String, default: 'Contact Us' },
    secondaryButtonLink: { type: String, default: '#contact' },
    pinnedImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

const HomePageSettingsSchema = new mongoose.Schema({
    contactDetails: { type: ContactDetailsSchema, default: () => ({}) },
    aboutUs: { type: AboutUsSchema, default: () => ({}) },
    heroSection: { type: HeroSectionSchema, default: () => ({}) },
    collectionCategories: [CollectionCategorySchema],
    customSections: [CustomSectionSchema],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Ensure only one active settings document
HomePageSettingsSchema.pre('save', async function(next) {
    if (this.isActive) {
        await mongoose.model('HomePageSettings').updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
    this.updatedAt = new Date();
    next();
});

export const HomePageSettings = mongoose.models.HomePageSettings || mongoose.model('HomePageSettings', HomePageSettingsSchema);