import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

/**
 * Props del componente PromotionModal
 */
interface PromotionModalProps {
    /**
     * Datos de la promoción activa
     */
    promotion: {
        url: string;        // URL de la imagen de la promoción
        link?: string;      // Link externo opcional al hacer click
        name?: string;      // Nombre de la promoción
    } | null;
    /**
     * Retraso en milisegundos antes de mostrar el modal (default: 1000ms)
     */
    delay?: number;
    /**
     * Controla si el modal debe mostrarse (default: true)
     */
    trigger?: boolean;
}

/**
 * Componente PromotionModal
 * 
 * Modal emergente que muestra promociones activas configuradas por el admin.
 * Se abre automáticamente al cargar el sitio (después de la intro).
 * 
 * Features:
 * - Se abre automáticamente al detectar una promoción activa
 * - Espera a que la imagen cargue antes de mostrar
 * - Botón opcional con link externo
 * - Botón de cerrar
 * - Animaciones de entrada/salida con Framer Motion
 */
export const PromotionModal: React.FC<PromotionModalProps> = ({ promotion, delay = 1000, trigger = true }) => {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Controla la apertura del modal
     * 
     * 1. Verifica que haya promoción y que el trigger esté activo
     * 2. Precarga la imagen para evitar parpadeos
     * 3. Abre el modal después de un retraso
     */
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
                }, 300);
            }
        };

        return () => {
            isMounted = false;
        };
    }, [promotion, delay, trigger]);

    /**
     * Cierra el modal
     */
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
