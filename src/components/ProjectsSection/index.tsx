'use client';

import { useState, useEffect } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { ProjectCard } from './ProjectCard';
import { categories as staticCategories, projects } from './data';
import { Category } from '@/types';

interface DynamicCategory {
  id: string;
  name: string;
  label: string;
  description?: string;
  isEnabled: boolean;
  order: number;
}

export default function ProjectsSection() {
  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      const data = await response.json();
      
      if (data.success && data.settings.collectionCategories?.length > 0) {
        const dynamicCategories: Category[] = data.settings.collectionCategories
          .filter((cat: DynamicCategory) => cat.isEnabled)
          .sort((a: DynamicCategory, b: DynamicCategory) => a.order - b.order)
          .map((cat: DynamicCategory) => ({
            id: cat.id,
            name: cat.name,
            label: cat.label
          }));
        
        // Add 'all' category at the beginning
        setCategories([
          { id: 'all', name: 'All', label: 'All' },
          ...dynamicCategories
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Keep static categories on error
    }
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="collections" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
            Our <span className="text-amber-600">Collections</span>
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explore our extensive range of premium natural stones and designer tiles
          </p>
        </div>

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
      </div>
    </section>
  );
} 