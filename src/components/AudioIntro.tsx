import { useState, useRef } from 'react';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AudioIntro({ onEnter }: { onEnter: () => void }) {
    const [isVisible, setIsVisible] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleEnter = () => {
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        setIsVisible(false);
        onEnter();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 cursor-pointer"
                    onClick={handleEnter}
                >
                    {/* Main Audio Element - Source will be placed by user */}
                    <audio ref={audioRef} src="/music/el_don.mp3" loop preload="auto" />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-center flex flex-col items-center"
                    >
                        {/* Replaced Text with Logo */}
                        <img
                            src="/images/logo.png"
                            alt="Sweetjay Logo"
                            className="w-64 md:w-96 h-auto object-contain mb-8 drop-shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                        />

                        <p className="text-gray-400 text-sm md:text-base tracking-[0.2em] mb-12 uppercase">
                            La experiencia oficial
                        </p>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-neon-green/50 text-white rounded-full font-bold uppercase tracking-widest hover:bg-neon-green hover:text-black hover:border-neon-green transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Play size={18} className="fill-current" />
                                Entrar
                            </span>
                            <div className="absolute inset-0 bg-neon-green/20 blur-xl group-hover:bg-neon-green/40 transition-all duration-300"></div>
                        </button>

                        <p className="mt-8 text-gray-600 text-xs animate-pulse">
                            Haz click para iniciar con música
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
