import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/HeroSection'), {
  ssr: true
});

const ProjectsSection = dynamic(() => import('@/components/ProjectsSection/index'), {
  ssr: true
});

const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  ssr: true
});

const CustomSection = dynamic(() => import('@/components/CustomSection'), {
  ssr: true
});

async function getHomePageSettings() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/homepage-settings`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch homepage settings');
    }
    
    const data = await response.json();
    return data.success ? data.settings : null;
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return null;
  }
}

export default async function Home() {
  const settings = await getHomePageSettings();
  const customSections = settings?.customSections?.filter((section: any) => section.isEnabled)
    .sort((a: any, b: any) => a.order - b.order) || [];

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
      </Suspense>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <CardDeckSection />
      </Suspense> */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <AboutSection />
      </Suspense>

      {/* Render custom sections dynamically */}
      {customSections.map((section: any, index: number) => (
        <Suspense key={section.id} fallback={<div>Loading...</div>}>
          <CustomSection section={section} />
        </Suspense>
      ))}
    </main>
  );
}
