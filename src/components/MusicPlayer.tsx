import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Method 1: Try standard autoplay
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay blocked. Waiting for interaction.");
                }
            }
        };
        playAudio();

        // Method 2: Force play on ANY first interaction (click/scroll/touch)
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        // Remove listeners once playing
                        ['click', 'scroll', 'touchstart', 'keydown'].forEach(event =>
                            document.removeEventListener(event, handleInteraction)
                        );
                    })
                    .catch(e => console.log("Still blocked:", e));
            }
        };

        // Add listeners for common interactions
        ['click', 'scroll', 'touchstart', 'keydown'].forEach(event =>
            document.addEventListener(event, handleInteraction, { once: true })
        );

        return () => {
            ['click', 'scroll', 'touchstart', 'keydown'].forEach(event =>
                document.removeEventListener(event, handleInteraction)
            );
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-neon-green/30 p-2 rounded-full shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <audio ref={audioRef} src="/music/tu_foto.mp3" loop preload="auto" autoPlay />

            <button
                onClick={togglePlay}
                className="p-3 bg-neon-green text-black rounded-full hover:bg-white transition-colors"
            >
                {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
            </button>

            <div className="hidden md:flex items-center gap-2 px-2">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tu Foto</span>
                    <span className="text-[10px] text-gray-400">SweetJay</span>
                </div>
                <button onClick={toggleMute} className="ml-2 text-white hover:text-neon-green">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
            </div>
        </div>
    );
}
