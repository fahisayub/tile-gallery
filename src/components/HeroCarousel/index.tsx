'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CarouselItem {
  id: number;
  imagePath: string;
  title: string;
  description: string;
}

const items: CarouselItem[] = [
  {
    id: 1,
    imagePath: '/hero/hero-1.jpg',
    title: 'Premium Natural Stones',
    description: 'Transform your space with our exquisite collection'
  },
  {
    id: 2,
    imagePath: '/hero/hero-2.jpg',
    title: 'Luxury Floor Tiles',
    description: 'Elevate your interiors with premium flooring solutions'
  },
  {
    id: 3,
    imagePath: '/hero/hero-3.jpg',
    title: 'Outdoor Collections',
    description: 'Create stunning outdoor spaces that last'
  }
];

export function HeroCarousel() {
  const [leftIndex, setLeftIndex] = useState(items.length - 1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(1);

  const updateIndexes = (newActiveIndex: number) => {
    setLeftIndex(newActiveIndex === 0 ? items.length - 1 : newActiveIndex - 1);
    setActiveIndex(newActiveIndex);
    setRightIndex(newActiveIndex === items.length - 1 ? 0 : newActiveIndex + 1);
  };

  const handlePrevious = () => {
    const newActiveIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    updateIndexes(newActiveIndex);
  };

  const handleNext = useCallback(() => {
    const newActiveIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    updateIndexes(newActiveIndex);
  }, [activeIndex]);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Left Card */}
        <motion.div
          key={`left-${leftIndex}`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.7 }}
          className="hidden md:block relative w-1/3 h-[500px] -mr-16 z-0"
        >
          <Image
            src={items[leftIndex].imagePath}
            alt={items[leftIndex].title}
            fill
            className="object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/50 rounded-xl" />
        </motion.div>

        {/* Active Card */}
        <motion.div
          key={`active-${activeIndex}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative w-full md:w-1/2 h-[400px] md:h-[600px] z-10"
        >
          <Image
            src={items[activeIndex].imagePath}
            alt={items[activeIndex].title}
            fill
            className="object-cover rounded-xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-xl" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-center">
            <div className="inline-block px-3 py-1 bg-amber-600 text-white text-sm rounded-full mb-2 md:mb-4">
              {items[activeIndex].title}
            </div>
            <p className="text-sm md:text-xl text-stone-200">
              {items[activeIndex].description}
            </p>
          </div>

          <button 
            onClick={handlePrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </button>
        </motion.div>

        {/* Right Card */}
        <motion.div
          key={`right-${rightIndex}`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.7 }}
          className="hidden md:block relative w-1/3 h-[500px] -ml-16 z-0"
        >
          <Image
            src={items[rightIndex].imagePath}
            alt={items[rightIndex].title}
            fill
            className="object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/50 rounded-xl" />
        </motion.div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-1 md:gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => updateIndexes(index)}
            className={`p-1 rounded-full transition-colors ${
              index === activeIndex ? 'bg-white' : 'bg-white/50'
            }`}
          >
            <Circle className="w-1.5 h-1.5 md:w-2 md:h-2" />
          </button>
        ))}
      </div>
    </div>
  );
} 