'use client';

import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      <button
        onClick={() => onCategoryChange('all')}
        className={`
          px-6 py-3 text-sm font-medium rounded-lg transition-all
          ${selectedCategory === 'all' 
            ? 'bg-amber-600 text-white shadow-lg' 
            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }
        `}
      >
        All Collections
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-6 py-3 text-sm font-medium rounded-lg transition-all
            ${selectedCategory === category.id 
              ? 'bg-amber-600 text-white shadow-lg' 
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }
          `}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
} 