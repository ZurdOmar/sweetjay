import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

interface PromotionModalProps {
    promotion: {
        url: string;
        link?: string;
        name?: string;
    } | null;
    delay?: number;
    trigger?: boolean;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ promotion, delay = 1000, trigger = true }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        console.log("PromotionModal Effect:", { promotion: !!promotion, trigger, isOpen });
        if (!promotion || !trigger) return;

        let isMounted = true;
        const img = new window.Image();
        img.src = promotion.url;

        img.onload = () => {
            if (isMounted) {
                setTimeout(() => {
                    console.log("PromotionModal Opening...");
                    setIsOpen(true);
                }, 300); // Reduced delay for better UX after click
            }
        };

        return () => {
            isMounted = false;
        };
    }, [promotion, delay, trigger]);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!promotion || !promotion.url) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative z-10 w-full max-w-2xl bg-dark-card border border-neon-pink/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,0,127,0.3)]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 bg-black/60 hover:bg-neon-pink text-white p-2 rounded-full z-20 transition-all hover:scale-110"
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative">
                            {/* Image */}
                            <img
                                src={promotion.url}
                                alt={promotion.name || "Promoción"}
                                className="w-full h-auto object-contain max-h-[70vh] block"
                            />

                            {/* Bottom Bar / Action */}
                            <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-4">
                                {promotion.link ? (
                                    <a
                                        href={promotion.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-neon-pink text-black font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-white transition-all transform hover:scale-105 flex items-center gap-2"
                                    >
                                        Ver Más <ExternalLink size={18} />
                                    </a>
                                ) : (
                                    <button
                                        onClick={handleClose}
                                        className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full transition-all border border-white/20"
                                    >
                                        Entendido
                                    </button>
                                )}
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
                                >
                                    Cerrar por ahora
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
