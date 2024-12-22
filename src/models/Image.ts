import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    imgurId: String,
    url: { type: String, required: true },
    deleteHash: String,
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    altText: { type: String, default: 'mukalel paving stone and tiles' },
    tags: { type: [String], default: ['all'] },
    isPinned: { type: Boolean, default: false },
    saveCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    contactCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema); 