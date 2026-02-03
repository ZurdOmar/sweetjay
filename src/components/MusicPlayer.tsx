import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export interface MusicPlayerHandle {
    forcePlay: () => void;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle>((_props, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Start unmuted because we have a user gesture now
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useImperativeHandle(ref, () => ({
        forcePlay: () => {
            const audio = audioRef.current;
            if (audio) {
                audio.muted = false;
                setIsMuted(false);
                audio.play().catch(e => console.error("Force play failed:", e));
            }
        }
    }));

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Configuration inicial
        audio.volume = 1.0;

        // Atributo muted inicial para ayudar al navegador a precargar
        audio.muted = true;
        setIsMuted(true);

    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.muted = false;
            setIsMuted(false);
            audio.play().catch(() => { });
        } else {
            audio.pause();
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = !audio.muted;
        setIsMuted(audio.muted);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-neon-pink/30 p-2 rounded-full shadow-[0_0_15px_rgba(255,0,127,0.2)]">
            <audio
                ref={audioRef}
                src="/music/tu_foto.mp3"
                loop
                preload="auto"
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <button
                onClick={togglePlay}
                className="p-3 bg-neon-pink text-black rounded-full hover:bg-white transition-colors relative"
            >
                {!isPlaying && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                )}
                {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
            </button>

            <div className="hidden md:flex items-center gap-2 px-2">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tu Foto</span>
                    <span className="text-[10px] text-gray-400">SweetJay</span>
                </div>
                <button onClick={toggleMute} className="ml-2 text-white hover:text-neon-pink transition-colors">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
            </div>
        </div>
    );
});
