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

export default function Home() {
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
    </main>
  );
}
