import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

interface WatermarkOptions {
    position?: 'topRight' | 'middleRight' | 'bottomRight';
    opacity?: number;
    size?: number;
}

export async function addWatermark(
    imageBuffer: Buffer,
    options: WatermarkOptions = {}
): Promise<Buffer> {
    const {
        position = 'topRight',
        opacity = 0.8,
        size = 0.4
    } = options;

    try {
        const logoPath = path.join(process.cwd(), 'public', 'Mptslogo.png');

        // Check if logo exists
        await fs.access(logoPath);

        // Get the dimensions of the input image
        const imageInfo = await sharp(imageBuffer).metadata();
        const imageWidth = imageInfo.width || 800;
        const imageHeight = imageInfo.height || 600;

        // Prepare the watermark
        const watermarkWidth = Math.floor(imageWidth * size);
        const watermark = await sharp(logoPath)
            .resize({ width: watermarkWidth })
            .ensureAlpha()
            .composite([{
                input: Buffer.from([255, 255, 255, Math.round(opacity * 255)]),
                raw: {
                    width: 1,
                    height: 1,
                    channels: 4
                },
                tile: true,
                blend: 'dest-in'
            }])
            .toBuffer();

        // Get watermark dimensions after resize
        const watermarkInfo = await sharp(watermark).metadata();
        const watermarkHeight = watermarkInfo.height || 0;

        // Calculate position
        let left = 0;
        let top = 0;

        switch (position) {
            case 'topRight':
                left = imageWidth - watermarkWidth - 20;
                top = 20;
                break;
            case 'middleRight':
                left = imageWidth - watermarkWidth - 20;
                top = Math.round((imageHeight - watermarkHeight) / 2);
                break;
            case 'bottomRight':
                left = imageWidth - watermarkWidth - 20;
                top = imageHeight - watermarkHeight - 20;
                break;
        }

        // Apply watermark to the original image
        return await sharp(imageBuffer)
            .composite([{
                input: watermark,
                left,
                top,
                blend: 'over'
            }])
            .jpeg({ quality: 90 })
            .toBuffer();
    } catch (error) {
        if (error instanceof Error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                throw new Error('Watermark logo file not found. Please ensure Mptslogo.png exists in the public directory.');
            }
        }
        console.error('Watermark error:', error);
        throw new Error('Failed to add watermark to image');
    }
} 