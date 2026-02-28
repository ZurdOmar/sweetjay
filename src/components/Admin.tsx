import React, { useState, useEffect } from 'react';
import { auth, storage, db } from '../firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { LogIn, LogOut, Upload, Image as ImageIcon, Music as MusicIcon, Calendar, CheckCircle2, Youtube, Megaphone, Trash2, RefreshCw } from 'lucide-react';

export const Admin = () => {
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');

    // States for existing content
    const [imagesList, setImagesList] = useState<any[]>([]);
    const [musicList, setMusicList] = useState<any[]>([]);
    const [eventsList, setEventsList] = useState<any[]>([]);
    const [videosList, setVideosList] = useState<any[]>([]);
    const [adsList, setAdsList] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            setUser(currentUser);
        });

        // Check if the user is returning from the email link
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let savedEmail = window.localStorage.getItem('emailForAdminSignIn');
            if (!savedEmail) {
                // In case they opened the link on a different device/browser, we can ask for it, 
                // but since it's restricted anyway we can prompt for it
                savedEmail = window.prompt('Por favor ingresa tu correo para confirmar la autenticación');
            }
            if (savedEmail) {
                signInWithEmailLink(auth, savedEmail, window.location.href)
                    .then(() => {
                        window.localStorage.removeItem('emailForAdminSignIn');
                        setMessage('¡Sesión iniciada con éxito!');
                    })
                    .catch((error) => {
                        setMessage('Error validando el enlace: ' + error.message);
                    });
            }
        }

        return () => unsubscribe();
    }, []);

    // Replace the strings array hack with explicit queries for type safety
    const refreshData = async () => {
        if (!user) return;
        setLoadingData(true);

        const fetchCollection = async (colName: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
            try {
                const q = query(collection(db, colName));
                const snapshot = await getDocs(q);
                const docsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log(`Colección ${colName} obtenida con ${docsData.length} registros:`, docsData);
                // Sort client-side to avoid missing index errors in Firestore
                docsData.sort((a: any, b: any) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA; // Descending
                });
                setter(docsData);
            } catch (err: any) {
                console.error(`Error crítico al cargar la colección ${colName}:`, err);
                setMessage((prev) => prev ? `${prev} | Error en ${colName}: ${err.message}` : `Error al cargar ${colName}: ${err.message}`);
            }
        };

        // Fetch each independently so one failure doesn't block the others
        await Promise.allSettled([
            fetchCollection('images', setImagesList),
            fetchCollection('music', setMusicList),
            fetchCollection('events', setEventsList),
            fetchCollection('videos', setVideosList),
            fetchCollection('ads', setAdsList)
        ]);

        setLoadingData(false);
    };

    useEffect(() => {
        if (user) {
            refreshData();
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email !== 'morentinomar@gmail.com') {
            setMessage('Acceso denegado: Correo no autorizado.');
            return;
        }

        setLoading(true);
        try {
            const actionCodeSettings = {
                // Detect if running locally or in production
                url: window.location.origin + '/admin',
                handleCodeInApp: true,
            };

            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForAdminSignIn', email);
            setMessage('¡Enlace enviado! Revisa la bandeja de entrada de morentinomar@gmail.com');
        } catch (error: any) {
            setMessage('Error: ' + error.message);
        }
        setLoading(false);
    };

    const handleLogout = () => signOut(auth);

    const handleAddYoutubeLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!youtubeLink) return;
        setUploading(true);
        try {
            await addDoc(collection(db, 'videos'), {
                url: youtubeLink,
                createdAt: new Date().toISOString()
            });
            setMessage('¡Enlace de YouTube guardado con éxito!');
            setYoutubeLink('');
            refreshData();
        } catch (error: any) {
            setMessage('Error al guardar: ' + error.message);
        }
        setUploading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot: any) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (error: any) => {
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
                refreshData();
            }
        );
    };

    const handleDelete = async (collectionName: string, id: string, fileUrl?: string) => {
        if (!window.confirm("¿Estás seguro de que quieres borrar este elemento permanentemente?")) return;

        setUploading(true);
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, collectionName, id));

            // If it's a file stored in Firebase Storage (not just a YouTube text link), delete it from Storage
            if (fileUrl && fileUrl.includes('firebasestorage')) {
                // Extract file path from url or assume typical format by keeping a reference
                // Firebase URLs look like https://firebasestorage.googleapis.com/.../o/folder%2Ffilename?alt=...
                const fileRef = ref(storage, fileUrl);
                await deleteObject(fileRef);
            }

            setMessage('Elemento borrado con éxito.');
            refreshData();
        } catch (error: any) {
            setMessage('Error al borrar: ' + error.message);
        }
        setUploading(false);
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neon-pink text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <LogIn size={20} />
                            {loading ? 'Enviando enlace...' : 'Enviar enlace de acceso'}
                        </button>
                    </div>
                    {message && <p className="mt-4 text-center text-sm text-neon-pink font-bold">{message}</p>}
                    <p className="mt-6 text-center text-xs text-gray-500">Solo administradores autorizados recibirán el enlace. No se requiere contraseña.</p>
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

                    {/* Videos Management (YouTube Links) */}
                    <div className="bg-dark-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                        <Youtube size={48} className="text-neon-pink mb-4" />
                        <h3 className="font-bold mb-2">Videos (YouTube)</h3>
                        <p className="text-sm text-gray-400 mb-6">Pega el enlace de tus videos.</p>
                        <form onSubmit={handleAddYoutubeLink} className="w-full flex flex-col gap-2">
                            <input
                                type="url"
                                placeholder="https://youtube.com/watch?v=..."
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-neon-pink outline-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={uploading || !youtubeLink}
                                className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-white/10 w-full flex items-center justify-center disabled:opacity-50"
                            >
                                <Upload size={16} className="inline mr-2" /> Guardar Enlace
                            </button>
                        </form>
                    </div>

                    {/* Announcements / Ads */}
                    <div className="bg-dark-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                        <Megaphone size={48} className="text-neon-pink mb-4" />
                        <h3 className="font-bold mb-2">Anuncios / Banners</h3>
                        <p className="text-sm text-gray-400 mb-6">Sube banners publicitarios promocionales.</p>
                        <label className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-white/10 w-full">
                            <Upload size={16} className="inline mr-2" /> Subir Anuncio
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'ads')} />
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

                {/* Manage Existing Content Section */}
                <div className="mt-16">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">Gestionar Contenido Activo</h2>
                        <button
                            onClick={refreshData}
                            disabled={loadingData}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-pink transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loadingData ? "animate-spin" : ""} />
                            {loadingData ? "Cargando..." : "Actualizar listas"}
                        </button>
                    </div>

                    <div className="space-y-12">
                        {/* Ads / Banners List */}
                        {adsList.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Megaphone size={20} className="text-neon-pink" /> Anuncios / Banners Promocionales ({adsList.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {adsList.map((item) => (
                                        <div key={item.id} className="relative group bg-dark-card border border-white/10 rounded-lg overflow-hidden">
                                            <img src={item.url} alt={item.name} className="w-full h-32 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <button onClick={() => handleDelete('ads', item.id, item.url)} className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Borrar">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Events List */}
                        {eventsList.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar size={20} className="text-neon-pink" /> Flyers de Eventos ({eventsList.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {eventsList.map((item) => (
                                        <div key={item.id} className="relative group bg-dark-card border border-white/10 rounded-lg overflow-hidden">
                                            <img src={item.url} alt={item.name} className="w-full h-40 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <button onClick={() => handleDelete('events', item.id, item.url)} className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Borrar">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Photos/Gallery List */}
                        {imagesList.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon size={20} className="text-neon-pink" /> Fotos en Galería ({imagesList.length})</h3>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                    {imagesList.map((item) => (
                                        <div key={item.id} className="relative group bg-dark-card border border-white/10 rounded-lg overflow-hidden">
                                            <img src={item.url} alt={item.name} className="w-full h-24 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <button onClick={() => handleDelete('images', item.id, item.url)} className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Borrar">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* YouTube Videos List */}
                        {videosList.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Youtube size={20} className="text-neon-pink" /> Enlaces de Videos YouTube ({videosList.length})</h3>
                                <div className="space-y-3">
                                    {videosList.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-dark-card border border-white/10 rounded-lg p-3">
                                            <a href={item.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate mr-4">
                                                {item.url}
                                            </a>
                                            <button onClick={() => handleDelete('videos', item.id)} className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-lg transition-colors flex-shrink-0">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Music List */}
                        {musicList.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MusicIcon size={20} className="text-neon-pink" /> Música MP3 ({musicList.length})</h3>
                                <div className="space-y-3">
                                    {musicList.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-dark-card border border-white/10 rounded-lg p-3">
                                            <span className="text-sm font-medium truncate mr-4">{item.name || "Pista de audio"}</span>
                                            <button onClick={() => handleDelete('music', item.id, item.url)} className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-lg transition-colors flex-shrink-0">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!loadingData && adsList.length === 0 && eventsList.length === 0 && imagesList.length === 0 && videosList.length === 0 && musicList.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No hay contenido subido todavía. Empieza subiendo algunas fotos, música o videos arriba.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
