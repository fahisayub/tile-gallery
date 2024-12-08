import { Phone, Clock, MapPin } from 'lucide-react';

export const Footer = () => {
    const quickLinks = [
        { name: 'Our Projects', href: '#collections' },
        { name: 'Stone Collection', href: '#collections' },
        { name: 'Tile Gallery', href: '#collections' },
        { name: 'About Us', href: '#about' },
        { name: 'Contact Us', href: '#contact' },
        { 
            name: 'Get Directions', 
            href: 'https://maps.app.goo.gl/B7RSb6ifDFCisbi98',
            external: true 
        }
    ];

    return (
        <footer id="contact" className="py-12 bg-stone-900 text-stone-400">
            <div className="container mx-auto px-6">
                <div className="mb-12 rounded-xl overflow-hidden h-[300px] relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.0647435833837!2d76.66788867508366!3d10.030573184009153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e1d3a4b5b8a9%3A0x3b07e1d3a4b5b8a9!2zMTDCsDAxJzUwLjEiTiA3NsKwNDAnMTIuMyJF!5e0!3m2!1sen!2sin!4v1709825997496!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <span className="text-xl font-bold text-stone-100">
                            Mukalel<span className="text-amber-600"> Paving Stone & Tiles</span>
                        </span>
                        <p className="mt-4">Excellence in stone and tile craftsmanship serving Kerala since 1998.</p>
                    </div>
                    <div>
                        <h4 className="text-stone-100 font-medium mb-4">Contact</h4>
                        <div className="space-y-3">
                            <a
                                href="https://maps.app.goo.gl/B7RSb6ifDFCisbi98"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center hover:text-amber-500 transition-colors group"
                            >
                                <MapPin  className="mr-2 size-9 text-amber-600 group-hover:scale-110 transition-transform" />
                                <span>Mukalel Paving Stone & Tiles ,Near Jamaath Hall, Pallarimangalam, Kotamangalam, Kerala 686671</span>
                            </a>
                            <a
                                href="tel:9961206232"
                                className="flex items-center hover:text-amber-500 transition-colors group"
                            >
                                <Phone className="mr-2 size-4 text-amber-600 group-hover:scale-110 transition-transform" />
                                <span>+91 9961206232</span>
                            </a>
                            <div className="flex items-center">
                                <Clock className="mr-2 size-4 text-amber-600" />
                                <span>Mon-Sat: 9AM-7PM</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-stone-100 font-medium mb-4">Quick Links</h4>
                        <div className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    target={link.external ? '_blank' : '_self'}
                                    rel={link.external ? 'noopener noreferrer' : ''}
                                    className="block hover:text-amber-500 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-6 right-6 md:hidden">
                    <a
                        href="tel:9961206232"
                        className="flex items-center justify-center w-14 h-14 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-500 transition-colors"
                    >
                        <Phone size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
}; 