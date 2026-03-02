import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Megaphone } from 'lucide-react';

interface PromotionBannerProps {
    promotion: {
        url: string;
        link?: string;
        name?: string;
    } | null;
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({ promotion }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!promotion || !promotion.url || !isVisible) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 flex justify-center pointer-events-none"
        >
            <div className="relative pointer-events-auto w-full max-w-4xl bg-black/90 backdrop-blur-md border border-neon-pink/30 rounded-2xl shadow-[0_-10px_40px_rgba(255,0,127,0.15)] overflow-hidden flex items-center group">
                {/* Content */}
                <div className="flex-1 flex items-center gap-4 p-3 md:p-4">
                    <div className="hidden sm:flex h-12 w-12 rounded-lg bg-neon-pink/10 items-center justify-center text-neon-pink shrink-0">
                        <Megaphone size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-neon-pink font-black text-[10px] uppercase tracking-[0.2em] mb-0.5">Promoción Especial</p>
                        <h4 className="text-white font-bold text-sm md:text-base truncate">
                            {promotion.name || "¡Nueva promoción disponible!"}
                        </h4>
                    </div>

                    {promotion.link && (
                        <a
                            href={promotion.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-neon-pink text-black text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full hover:bg-white transition-all whitespace-now-nowrap flex items-center gap-2"
                        >
                            Ver <ExternalLink size={14} />
                        </a>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-4 text-gray-400 hover:text-white transition-colors border-l border-white/10"
                    aria-label="Cerrar banner"
                >
                    <X size={20} />
                </button>
            </div>
        </motion.div>
    );
};
