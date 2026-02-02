import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CAROUSEL_IMAGES = [
    '/images/carousel/photo1.jpg',
    '/images/carousel/photo2.jpg',
    '/images/carousel/photo3.jpg',
    '/images/carousel/photo4.jpg',
    '/images/carousel/photo5.jpg',
];

export function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-3xl mx-auto aspect-[4/5] md:aspect-square overflow-hidden shadow-2xl rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.8 } }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                >
                    {/* Main Image - Now using object-cover to fill space */}
                    <img
                        src={CAROUSEL_IMAGES[currentIndex]}
                        alt={`Sweetjay Photo ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {CAROUSEL_IMAGES.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-neon-green w-6' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
