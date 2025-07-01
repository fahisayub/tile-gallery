'use client';

import { motion } from 'framer-motion';
import { Star, Check, Users, Award, Wrench, Sparkles } from 'lucide-react';

interface CustomSectionProps {
  section: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    type: 'services' | 'features' | 'testimonials' | 'gallery' | 'custom';
    isEnabled: boolean;
    order: number;
    content?: any;
    images?: string[];
  };
}

const getServiceItems = () => [
  {
    icon: Wrench,
    title: 'Custom Installation',
    description: 'Professional installation services for all stone and tile projects'
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Premium quality materials with guaranteed satisfaction'
  },
  {
    icon: Users,
    title: 'Expert Consultation',
    description: 'Professional guidance for your perfect stone and tile selection'
  },
  {
    icon: Sparkles,
    title: 'Design Services',
    description: 'Custom design solutions tailored to your space and style'
  }
];

const getFeatureItems = () => [
  {
    title: 'Premium Quality',
    description: 'Highest grade natural stones and tiles',
    icon: '💎'
  },
  {
    title: 'Expert Craftsmanship',
    description: 'Skilled artisans with years of experience',
    icon: '🔨'
  },
  {
    title: 'Custom Solutions',
    description: 'Tailored designs for every project',
    icon: '🎨'
  },
  {
    title: 'Timely Delivery',
    description: 'On-time completion of all projects',
    icon: '⏱️'
  }
];

const getTestimonials = () => [
  {
    name: 'Rajesh Kumar',
    location: 'Kothamangalam',
    rating: 5,
    text: 'Excellent service and quality stones. Very satisfied with the work done.',
    image: '/placeholder-avatar.jpg'
  },
  {
    name: 'Priya Nair',
    location: 'Ernakulam',
    rating: 5,
    text: 'Professional team with great attention to detail. Highly recommended!',
    image: '/placeholder-avatar.jpg'
  },
  {
    name: 'Thomas Joseph',
    location: 'Muvattupuzha',
    rating: 5,
    text: 'Beautiful tiles and stones with competitive pricing. Great experience!',
    image: '/placeholder-avatar.jpg'
  }
];

export const CustomSection = ({ section }: CustomSectionProps) => {
  if (!section.isEnabled) return null;

  const renderServices = () => {
    const services = section.content?.services || getServiceItems();
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service: any, index: number) => {
          const IconComponent = service.icon || Wrench;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <IconComponent className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-stone-800">{service.title}</h3>
              <p className="text-stone-600">{service.description}</p>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderFeatures = () => {
    const features = section.content?.features || getFeatureItems();
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-stone-800">{feature.title}</h3>
            <p className="text-stone-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderTestimonials = () => {
    const testimonials = section.content?.testimonials || getTestimonials();
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-stone-200"
          >
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-stone-600 mb-4 italic">"{testimonial.text}"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-stone-200 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold text-stone-800">{testimonial.name}</p>
                <p className="text-sm text-stone-500">{testimonial.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderGallery = () => {
    const images = section.images || [];
    
    if (images.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-stone-500">No images available for this gallery.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCustomContent = () => {
    if (section.content?.html) {
      return (
        <div 
          className="prose prose-stone max-w-none"
          dangerouslySetInnerHTML={{ __html: section.content.html }}
        />
      );
    }
    
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">Custom content will be displayed here.</p>
      </div>
    );
  };

  const renderContent = () => {
    switch (section.type) {
      case 'services':
        return renderServices();
      case 'features':
        return renderFeatures();
      case 'testimonials':
        return renderTestimonials();
      case 'gallery':
        return renderGallery();
      case 'custom':
        return renderCustomContent();
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent"
          >
            {section.title}
          </motion.h2>
          {section.subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-amber-600 mb-4"
            >
              {section.subtitle}
            </motion.p>
          )}
          {section.description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-stone-600 max-w-2xl mx-auto"
            >
              {section.description}
            </motion.p>
          )}
        </div>

        {renderContent()}
      </div>
    </section>
  );
};

export default CustomSection;