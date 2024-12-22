import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { Image } from '@/models/Image';

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const images = await Image.find({})
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return NextResponse.json({
            success: true,
            images
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    }
} 