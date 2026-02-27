import React, { useState, useEffect } from 'react';
import { auth, storage, db } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { LogIn, LogOut, Upload, Image as ImageIcon, Music as MusicIcon, Calendar, CheckCircle2 } from 'lucide-react';

export const Admin = () => {
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage('Bienvenido, Admin.');
        } catch (error: any) {
            setMessage('Error: ' + error.message);
        }
        setLoading(false);
    };

    const handleLogout = () => signOut(auth);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (error) => {
                setMessage('Error al subir: ' + error.message);
                setUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                // Store metadata in Firestore if needed
                await addDoc(collection(db, folder), {
                    url,
                    name: file.name,
                    createdAt: new Date().toISOString()
                });
                setMessage(`¡Archivo ${file.name} subido con éxito!`);
                setUploading(false);
                setProgress(0);
            }
        );
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="bg-dark-card p-8 rounded-2xl border border-white/10 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-neon-pink">Panel de Administración</h2>
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-pink outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-pink outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neon-pink text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            <LogIn size={20} />
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                    {message && <p className="mt-4 text-center text-sm text-gray-400">{message}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold text-neon-pink">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white">
                        <LogOut size={20} /> Salir
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Photos Upload */}
                    <div className="bg-dark-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                        <ImageIcon size={48} className="text-neon-pink mb-4" />
                        <h3 className="font-bold mb-2">Fotos</h3>
                        <p className="text-sm text-gray-400 mb-6">Sube fotos para la galería y el carrusel.</p>
                        <label className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-white/10 w-full">
                            <Upload size={16} className="inline mr-2" /> Subir Foto
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'images')} />
                        </label>
                    </div>

                    {/* Music Upload */}
                    <div className="bg-dark-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                        <MusicIcon size={48} className="text-neon-pink mb-4" />
                        <h3 className="font-bold mb-2">Música</h3>
                        <p className="text-sm text-gray-400 mb-6">Sube nuevas canciones (.mp3).</p>
                        <label className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-white/10 w-full">
                            <Upload size={16} className="inline mr-2" /> Subir MP3
                            <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleUpload(e, 'music')} />
                        </label>
                    </div>

                    {/* Events Management */}
                    <div className="bg-dark-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                        <Calendar size={48} className="text-neon-pink mb-4" />
                        <h3 className="font-bold mb-2">Eventos</h3>
                        <p className="text-sm text-gray-400 mb-6">Sube flyers para próximos eventos.</p>
                        <label className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-white/10 w-full">
                            <Upload size={16} className="inline mr-2" /> Subir Flyer
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'events')} />
                        </label>
                    </div>
                </div>

                {uploading && (
                    <div className="mt-12">
                        <div className="flex justify-between mb-2">
                            <span>Subiendo archivo...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                            <div
                                className="bg-neon-pink h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="mt-8 p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-lg flex items-center gap-3 text-neon-pink">
                        <CheckCircle2 size={20} />
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
