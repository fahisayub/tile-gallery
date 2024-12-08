'use client';

import { useState, useEffect } from 'react';
import { Project, Category } from '@/types';
import { ProjectCard } from '@/components/ProjectsSection/ProjectCard';
import { CategoryFilter } from '@/components/ProjectsSection/CategoryFilter';

interface ProjectGridProps {
  initialProjects: Project[];
  categories: Category[];
}

export default function ProjectGrid({ initialProjects, categories }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Listen for URL hash changes to switch categories
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const category = categories.find(cat => cat.id === hash.replace('#', ''));
      if (category) {
        setSelectedCategory(category.id);
      }
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  const filteredProjects = selectedCategory === 'all' 
    ? initialProjects 
    : initialProjects.filter(project => project.category === selectedCategory);

  return (
    <>
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
} 