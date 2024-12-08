'use client';

import CardDeckSection from './CardDeckSection/CardDeckSection';
import { motion } from 'framer-motion';

/* eslint-disable @typescript-eslint/no-unused-vars */

export const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-200 to-amber-100/30 opacity-90" />
      <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-soft-light opacity-50" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-amber-200/20 to-stone-400/20 blur-[100px] transform rotate-12" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-stone-300/20 to-amber-300/20 blur-[100px] transform -rotate-12" />

      {/* Content */}
      <div className="container mx-auto px-4 relative pt-20 pb-12 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
        {/* Text Content - Below carousel on mobile/tablet, left side on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/3 text-center lg:text-left space-y-6 mt-8 lg:mt-0"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
            Premium Natural Stone & Tiles
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto lg:mx-0">
            Transform your space with our exquisite collection of natural stones and premium tiles
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a 
              href="#collections" 
              className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
            >
              View Collections
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>

        {/* Carousel - Top on mobile/tablet, right side on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-2/3"
        >
          <CardDeckSection />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 