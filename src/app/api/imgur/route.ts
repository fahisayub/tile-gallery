import { NextRequest, NextResponse } from 'next/server';
import { Image } from '@/models/Image';
import { addWatermark } from '@/utils/watermark';
import { connectToDatabase } from '@/utils/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const imageFile = formData.get('image') as Blob;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const watermarkedBuffer = await addWatermark(buffer);

    const imgurFormData = new FormData();
    imgurFormData.append('image', new Blob([watermarkedBuffer], { type: 'image/jpeg' }));

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
      },
      body: imgurFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.data?.error || 'Upload failed' },
        { status: response.status }
      );
    }

    const image = await Image.create({
      imgurId: data.data.id,
      url: data.data.link,
      deleteHash: data.data.deletehash,
      title: '',
      description: '',
      altText: 'mukalel paving stone and tiles',
      tags: ['all'],
      isPinned: false,
      saveCount: 0,
      shareCount: 0,
      contactCount: 0
    });

    return NextResponse.json({
      success: true,
      data: {
        ...data.data,
        _id: image._id,
        mongoId: image._id
      }
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 