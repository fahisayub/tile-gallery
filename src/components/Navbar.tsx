'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const navigationItems = [
    { id: 'collections', label: 'Collections', href: '#collections' },
    { id: 'natural-stone', label: 'Natural Stone', href: '#collections', category: 'natural-stone' },
    { id: 'paving-tiles', label: 'Paving Tiles', href: '#collections', category: 'floor-tiles' },
    { id: 'about', label: 'About Us', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' }
];

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Handle smooth scrolling and tab switching
    const scrollToSection = (sectionId: string, category?: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 80; // Approximate navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // If category is provided and we're scrolling to collections, switch the tab
            if (category && sectionId === 'collections') {
                // Find the tab button for this category and click it
                setTimeout(() => {
                    const tabButton = document.querySelector(`[data-category="${category}"]`) as HTMLButtonElement;
                    if (tabButton) {
                        tabButton.click();
                    }
                }, 500); // Give time for smooth scroll to complete
            }
        }
    };

    // Update active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const sections = navigationItems.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + 100; // Add offset for navbar

            sections.forEach((section) => {
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        setActiveSection(section.id);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed w-full top-0 z-50 bg-stone-50/80 backdrop-blur-lg border-b border-stone-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="relative flex items-center"
                    >
                        <div className="relative w-32 md:w-40 h-12">
                            <Image
                                src="/Mptslogo.png"
                                alt="Mukalel Paving Stone & Tiles"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.href.slice(1), item.category)}
                                className={`text-sm font-medium transition-colors hover:text-amber-600
                                    ${activeSection === item.id ? 'text-amber-600' : 'text-stone-600'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-stone-600 hover:text-amber-600 transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-stone-200">
                        <div className="flex flex-col space-y-4">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.href.slice(1), item.category)}
                                    className={`text-sm font-medium transition-colors hover:text-amber-600 text-left
                                        ${activeSection === item.id ? 'text-amber-600' : 'text-stone-600'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 