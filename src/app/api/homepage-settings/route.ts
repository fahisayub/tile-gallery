import { NextRequest, NextResponse } from 'next/server';
import { HomePageSettings } from '@/models/HomePageSettings';
import { Image } from '@/models/Image';
import { connectToDatabase } from '@/utils/mongodb';

export async function GET() {
    try {
        await connectToDatabase();
        
        let settings = await HomePageSettings
            .findOne({ isActive: true })
            .populate('heroSection.pinnedImages');
        
        // If no settings exist, create default settings
        if (!settings) {
            settings = new HomePageSettings({
                collectionCategories: [
                    {
                        id: 'natural-stone',
                        name: 'Natural Stone',
                        label: 'Natural Stone',
                        description: 'Premium natural stone collection',
                        isEnabled: true,
                        order: 0
                    },
                    {
                        id: 'floor-tiles',
                        name: 'Paving Tiles', 
                        label: 'Paving Tiles',
                        description: 'High-quality paving tiles',
                        isEnabled: true,
                        order: 1
                    }
                ]
            });
            await settings.save();
        }

        return NextResponse.json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Error fetching homepage settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch homepage settings' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectToDatabase();
        
        const data = await req.json();
        
        let settings = await HomePageSettings.findOne({ isActive: true });
        
        if (!settings) {
            settings = new HomePageSettings(data);
        } else {
            Object.assign(settings, data);
        }
        
        await settings.save();
        
        const populatedSettings = await HomePageSettings
            .findById(settings._id)
            .populate('heroSection.pinnedImages');

        return NextResponse.json({
            success: true,
            settings: populatedSettings
        });
    } catch (error) {
        console.error('Error updating homepage settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update homepage settings' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        
        const { action, ...data } = await req.json();
        
        const settings = await HomePageSettings.findOne({ isActive: true });
        if (!settings) {
            return NextResponse.json(
                { success: false, error: 'No active settings found' },
                { status: 404 }
            );
        }

        switch (action) {
            case 'add-custom-section':
                settings.customSections.push({
                    id: data.id || `section-${Date.now()}`,
                    title: data.title,
                    subtitle: data.subtitle || '',
                    description: data.description || '',
                    type: data.type,
                    isEnabled: true,
                    order: settings.customSections.length,
                    content: data.content || {},
                    images: data.images || []
                });
                break;
                
            case 'update-custom-section':
                const sectionIndex = settings.customSections.findIndex(
                    (section: any) => section.id === data.id
                );
                if (sectionIndex !== -1) {
                    Object.assign(settings.customSections[sectionIndex], data);
                }
                break;
                
            case 'remove-custom-section':
                settings.customSections = settings.customSections.filter(
                    (section: any) => section.id !== data.id
                );
                break;
                
            case 'reorder-sections':
                data.sections.forEach((sectionData: any, index: number) => {
                    const section = settings.customSections.find(
                        (s: any) => s.id === sectionData.id
                    );
                    if (section) {
                        section.order = index;
                    }
                });
                settings.customSections.sort((a: any, b: any) => a.order - b.order);
                break;
                
            case 'update-pinned-images':
                settings.heroSection.pinnedImages = data.imageIds;
                break;
                
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }
        
        await settings.save();
        
        const populatedSettings = await HomePageSettings
            .findById(settings._id)
            .populate('heroSection.pinnedImages');

        return NextResponse.json({
            success: true,
            settings: populatedSettings
        });
    } catch (error) {
        console.error('Error handling homepage settings action:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to handle action' },
            { status: 500 }
        );
    }
}