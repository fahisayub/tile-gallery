import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema); 