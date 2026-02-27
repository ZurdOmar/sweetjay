import { motion } from 'framer-motion';

interface IntroProps {
    onEnter: () => void;
}

export function Intro({ onEnter }: IntroProps) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-12"
            >
                <img
                    src="/images/sweetj-2.png?v=2"
                    alt="Sweet J Logo"
                    className="w-72 md:w-[450px] h-auto object-contain drop-shadow-[0_0_35px_rgba(255,0,127,0.4)]"
                />
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEnter}
                className="px-12 py-4 bg-transparent border-2 border-neon-pink text-neon-pink font-bold text-xl uppercase tracking-widest hover:bg-neon-pink hover:text-black transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(255,0,127,0.3)]"
            >
                Entrar
            </motion.button>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 text-white text-xs uppercase tracking-widest"
            >
                Una experiencia inmersiva
            </motion.p>
        </motion.div>
    );
}
