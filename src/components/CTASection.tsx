'use client';

import { CheckCircle2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

export const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-20 bg-stone-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-stone-100 rounded-lg p-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-stone-800">Transform Your Space</h2>
              <p className="text-stone-600 mb-8">Book a consultation with our stone artisans</p>
              <div className="space-y-4">
                {[
                  'Premium Natural Stone Selection',
                  'Expert Craftsmanship',
                  'Lifetime Installation Warranty'
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-stone-600">
                    <CheckCircle2 className="mr-3 text-amber-600" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-lg bg-white/50 border border-stone-200 focus:ring-2 focus:ring-amber-600"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-4 rounded-lg bg-white/50 border border-stone-200 focus:ring-2 focus:ring-amber-600"
              />
              <textarea
                placeholder="Project Details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={4}
                className="w-full p-4 rounded-lg bg-white/50 border border-stone-200 focus:ring-2 focus:ring-amber-600"
              ></textarea>
              <button 
                type="submit"
                className="w-full bg-stone-800 text-stone-100 py-4 rounded-lg font-medium hover:bg-amber-600 transition-all"
              >
                Request Consultation
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}; 