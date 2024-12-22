import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { Image } from '@/models/Image';

export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const { isPinned } = body;

        if (isPinned) {
            const pinnedCount = await Image.countDocuments({ isPinned: true });
            if (pinnedCount >= 10) {
                return NextResponse.json(
                    { error: 'Maximum 10 images can be pinned' },
                    { status: 400 }
                );
            }
        }

        const updatedImage = await Image.findByIdAndUpdate(
            context.params.id,
            {
                $set: {
                    isPinned,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedImage) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            image: updatedImage
        });
    } catch (error) {
        console.error('Error updating image:', error);
        return NextResponse.json(
            { error: 'Failed to update image' },
            { status: 500 }
        );
    }
} 