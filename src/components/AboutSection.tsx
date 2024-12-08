'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Trophy, Users, Grid, Star } from 'lucide-react';
import Image from 'next/image';

const stats = [
  {
    id: 1,
    icon: Calendar,
    value: "Since 1998",
    label: "Years of Excellence",
    size: "col-span-2",
    order: "order-1",
    color: "from-amber-500/20 to-amber-600/20"
  },
  {
    id: 2,
    icon: Trophy,
    value: "1000+",
    label: "Projects Completed",
    size: "col-span-1 md:col-span-1",
    order: "order-2",
    color: "from-stone-700/20 to-stone-800/20"
  },
  {
    id: 3,
    icon: Grid,
    value: "50+",
    label: "Product Portfolio",
    size: "col-span-1 md:col-span-1",
    order: "order-3",
    color: "from-amber-600/20 to-amber-700/20"
  },
  {
    id: 4,
    icon: Users,
    value: "5000+",
    label: "Happy Customers",
    size: "col-span-2 md:col-span-1",
    order: "order-5",
    color: "from-stone-800/20 to-stone-900/20"
  },
  {
    id: 5,
    icon: MapPin,
    value: "Pallarimangalam",
    label: "Kothamangalam, Kerala",
    size: "col-span-2",
    order: "order-6",
    color: "from-amber-500/20 to-amber-600/20"
  },
  {
    id: 6,
    icon: Star,
    value: "Premium",
    label: "Quality Products",
    size: "col-span-2 md:col-span-1",
    order: "order-4",
    color: "from-stone-700/20 to-stone-800/20"
  }
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-stone-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
          About <span className="text-amber-600">Us</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-16">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: stat.id * 0.1 }}
              className={`${stat.size} ${stat.order} relative group overflow-hidden rounded-2xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 transform group-hover:scale-[0.98] transition-all duration-300 ease-out rounded-2xl" />
              <div className={`
                absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 
                group-hover:opacity-100 transition-all duration-300 ease-out rounded-2xl
              `} />
              <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 transform group-hover:translate-y-[-4px] transition-all duration-300 ease-out border border-stone-200/50">
                <div className="flex flex-col h-full justify-between">
                  <stat.icon
                    className={`w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4 text-amber-600`}
                  />
                  <div>
                    <div className="text-xl md:text-2xl font-bold mb-1 text-stone-900">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-stone-600">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center mb-12">
          <div className="relative w-32 h-32">
            <Image
              src="/nobglogo.png"
              alt="Mukalel Paving Stone & Tiles"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-stone-600">
            Mukalel Paving Stone & Tiles has been a trusted name in premium natural stones and tiles.
            Based in Pallarimangalam, Kothamangalam, we offer an extensive collection of high-quality materials
            and expert installation services.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 
