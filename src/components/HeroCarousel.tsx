import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export function HeroCarousel() {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const q = query(collection(db, 'carousel'), orderBy('createdAt', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);
                const fetchedImages = querySnapshot.docs.map(doc => doc.data().url);

                if (fetchedImages.length > 0) {
                    setImages(fetchedImages);
                } else {
                    // Fallback to static images if no images in Firebase
                    setImages([
                        '/images/slide1.png',
                        '/images/slide2.png',
                        '/images/slide3.png'
                    ]);
                }
            } catch (error) {
                console.error("Error fetching carousel images:", error);
                // Fallback
                setImages([
                    '/images/slide1.png',
                    '/images/slide2.png',
                    '/images/slide3.png'
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images]);

    if (loading || images.length === 0) {
        return (
            <div className="w-full max-w-lg aspect-square relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.3)] border border-neon-green/30 bg-black/50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg aspect-square relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.3)] border border-neon-green/30">
            <AnimatePresence mode='wait'>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Sweetjay Moment ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Overlay Gradient for better integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-neon-green w-6' : 'bg-white/50'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

