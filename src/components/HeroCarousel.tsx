import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

/**
 * Componente HeroCarousel
 * 
 * Muestra un carrusel de imágenes que rota automáticamente en la sección principal (Hero).
 * Las imágenes se cargan desde Firebase Firestore (colección 'carousel').
 * 
 * Features:
 * - Carga imágenes desde Firebase
 * - Fallback a imágenes estáticas si no hay datos en Firestore
 * - Transición suave entre slides (fade + scale)
 * - Indicadores de posición (puntos)
 * - Auto-rotación cada 4 segundos
 * - Ordenamiento por campo 'order' o 'createdAt'
 */
export function HeroCarousel() {
    // Estado del carrusel
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    /**
     * Carga las imágenes del carousel desde Firebase
     * 
     * Lógica de ordenamiento:
     * 1. Ordena por campo 'order' (ascendente)
     * 2. Si no hay 'order', usa 'createdAt' (descendente)
     * 3. Limita a 15 imágenes
     */
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const q = query(collection(db, 'carousel'));
                const querySnapshot = await getDocs(q);
                const fetchedDocs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as any[];

                // Ordenamiento: 'order' ascending, luego 'createdAt' descending
                const sortedImages = fetchedDocs
                    .sort((a, b) => {
                        const orderA = a.order !== undefined ? a.order : 999;
                        const orderB = b.order !== undefined ? b.order : 999;
                        if (orderA !== orderB) return orderA - orderB;

                        const timeA = a.createdAt?.seconds || 0;
                        const timeB = b.createdAt?.seconds || 0;
                        return timeB - timeA;
                    })
                    .slice(0, 15)
                    .map(doc => doc.url);

                // Si hay imágenes, las usa. Si no, fallback a estáticas
                if (sortedImages.length > 0) {
                    setImages(sortedImages);
                } else {
                    setImages([
                        '/images/slide1.png',
                        '/images/slide2.png',
                        '/images/slide3.png'
                    ]);
                }
            } catch (error) {
                console.error("Error fetching carousel images:", error);
                // Fallback en caso de error
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

    /**
     * Auto-rotación de slides cada 4 segundos
     */
    useEffect(() => {
        if (images.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images]);

    // Muestra loading spinner mientras carga
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

