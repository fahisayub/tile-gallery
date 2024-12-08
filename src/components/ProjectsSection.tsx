'use client';

import dynamic from 'next/dynamic';
import { categories, projects } from '@/components/ProjectsSection/data';

const ProjectGrid = dynamic(() => import('@/components/ProjectsSection/ProjectGrid'), {
  ssr: true
});

export const ProjectsSection = () => {
  return (
    <>
      <section id="collections" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-200 to-amber-100/30 opacity-90" />
        
        <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-soft-light opacity-50" />
        
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-amber-200/20 to-stone-400/20 blur-[100px] transform rotate-12" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-stone-300/20 to-amber-300/20 blur-[100px] transform -rotate-12" />
        
        <div className="container mx-auto px-6 relative">
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
            Our <span className="text-amber-600">Collections</span>
          </h2>
          
          <ProjectGrid 
            initialProjects={projects}
            categories={categories}
          />
        </div>
      </section>
    </>
  );
};

export default ProjectsSection; 