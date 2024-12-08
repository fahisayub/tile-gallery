'use client';

import { Project } from '@/types';
import { Share } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const shareOnWhatsApp = () => {
    const message = `Check out this amazing ${project.title} at Mukalel Paving Stone & Tiles!\n\n${project.description}\n\nContact us for more details.`;
    const whatsappUrl = `whatsapp://send?phone=+919961206232&text=${encodeURIComponent(message)}`;
    
    // Try mobile WhatsApp first
    window.location.href = whatsappUrl;
    
    // Fallback to web WhatsApp after a short delay if mobile didn't work
    setTimeout(() => {
      const webWhatsappUrl = `https://wa.me/919961206232?text=${encodeURIComponent(message)}`;
      window.open(webWhatsappUrl, '_blank');
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl aspect-[4/5]"
    >
      <div className="absolute inset-0">
        <Image
          src={project.imagePath || '/placeholder.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Content only visible on hover */}
        <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <h3 className="text-white text-xl font-bold">
              {project.title}
            </h3>
            {project.material && (
              <div className="text-amber-500 text-sm font-medium mt-1">
                {project.material}
              </div>
            )}
          </div>
        </div>

        {/* Share button on hover */}
        <div className="w-full flex justify-center transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={shareOnWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            <Share size={20} />
            Contact on WhatsApp
          </button>
        </div>
      </div>
    </motion.div>
  );
} 