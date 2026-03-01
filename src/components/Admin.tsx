import React, { useState, useEffect } from 'react';
import { auth, storage, db } from '../firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, query, deleteDoc, doc, setDoc } from 'firebase/firestore';
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
    const [carouselList, setCarouselList] = useState<any[]>([]);
    const [musicList, setMusicList] = useState<any[]>([]);
    const [eventsList, setEventsList] = useState<any[]>([]);
    const [videosList, setVideosList] = useState<any[]>([]);
    const [adsList, setAdsList] = useState<any[]>([]);
    const [eventsInfo, setEventsInfo] = useState<any>({ title: 'Tour 2025', description: 'Prepárate para vivir la experiencia de Sweetjay en vivo. Nuevas fechas, nuevos shows y toda la energía del género urbano.', footer: 'Próximamente más fechas...' });
    const [bioInfo, setBioInfo] = useState<any>({
        title: 'Originario de Colima, 27 años',
        content: `Sweetjay es un apasionado de la música y la expresión artística desde temprana edad. Inspirado por la necesidad de expresar sus sentimientos a través de melodías. Debuta con un EP **“MY ESSENCE”** producido por Yacknees en octubre del 2023.\n\nMiembro activo de **Flow312**, plataforma dedicada a promover el talento urbano colimense. Ha participado en ediciones exitosas de festivales urbanos y eventos locales de trap.`,
        highlights: [
            { title: 'Logros', content: '• Composición "Dos Locos" - Grupo Cañaveral (2019)\n• Colaboración con Armando Gómez (Latin Grammy)\n• Ranking Top #10 Radio 91.7 (2024)\n• Participación en "Colimán" con Antiwa', iconType: 'star' },
            { title: 'Impacto', content: 'Difusión de artistas locales y organización de eventos como Elixir vol1/vol2 y Flow312 Forum DMT.', iconType: 'disc' }
        ]
    });
    const [loadingData, setLoadingData] = useState(false);
    const [confirmEmailNeeded, setConfirmEmailNeeded] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const authProcessed = React.useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            setUser(currentUser);
        });

        // Check if the user is returning from the email link
        if (isSignInWithEmailLink(auth, window.location.href) && !authProcessed.current) {
            authProcessed.current = true;
            // Always show the custom form to confirm email (security/privacy as requested)
            setConfirmEmailNeeded(true);
        }

        return () => unsubscribe();
    }, []);

    const handleConfirmEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tempEmail) return;

        setLoading(true);
        try {
            await signInWithEmailLink(auth, tempEmail, window.location.href);
            setConfirmEmailNeeded(false);
            setMessage('¡Sesión iniciada con éxito!');
        } catch (error: any) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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
            fetchCollection('carousel', setCarouselList),
            fetchCollection('music', setMusicList),
            fetchCollection('events', setEventsList),
            fetchCollection('videos', setVideosList),
            fetchCollection('ads', setAdsList)
        ]);

        // Fetch events info
        try {
            const settingsDocs = await getDocs(query(collection(db, 'settings')));
            const evInfo = settingsDocs.docs.find(d => d.id === 'eventsInfo');
            if (evInfo) setEventsInfo(evInfo.data());

            const bInfo = settingsDocs.docs.find(d => d.id === 'bioInfo');
            if (bInfo) setBioInfo(bInfo.data());
        } catch (err) {
            console.error("Error fetching settings:", err);
        }

        setLoadingData(false);
    };

    useEffect(() => {
        if (user) {
            refreshData();
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const authorizedEmails = ['morentinomar@gmail.com', 'jeranmp8@gmail.com'];
        if (!authorizedEmails.includes(email)) {
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
            setMessage(`¡Enlace enviado! Revisa la bandeja de entrada de ${email}`);
        } catch (error: any) {
            setMessage('Error: ' + error.message);
        }
        setLoading(false);
    };

    const handleLogout = () => signOut(auth);

    const handleUpdateBioInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            await setDoc(doc(db, 'settings', 'bioInfo'), bioInfo);
            setMessage('¡Biografía actualizada con éxito!');
            refreshData();
        } catch (error: any) {
            setMessage('Error al actualizar Bio: ' + error.message);
        }
        setUploading(false);
    };

    const handleAddHighlight = () => {
        setBioInfo({
            ...bioInfo,
            highlights: [...bioInfo.highlights, { title: 'Nuevo Cuadro', content: 'Texto descriptivo...', iconType: 'star' }]
        });
    };

    const handleRemoveHighlight = (index: number) => {
        const newHighlights = [...bioInfo.highlights];
        newHighlights.splice(index, 1);
        setBioInfo({ ...bioInfo, highlights: newHighlights });
    };

    const handleHighlightChange = (index: number, field: string, value: string) => {
        const newHighlights = [...bioInfo.highlights];
        newHighlights[index] = { ...newHighlights[index], [field]: value };
        setBioInfo({ ...bioInfo, highlights: newHighlights });
    };

    const handleUpdateEventsInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            // We use setDoc with a specific ID to keep it simple
            await setDoc(doc(db, 'settings', 'eventsInfo'), eventsInfo);
            setMessage('¡Información de eventos actualizada con éxito!');
            refreshData();
        } catch (error: any) {
            setMessage('Error al actualizar: ' + error.message);
        }
        setUploading(false);
    };
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
                    createdAt: new Date().toISOString(),
                    type: folder === 'images' ? 'gallery' : (folder === 'carousel' ? 'carousel' : 'other')
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

    if (confirmEmailNeeded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <form onSubmit={handleConfirmEmail} className="bg-dark-card p-8 rounded-2xl border border-neon-pink/50 w-full max-w-md shadow-[0_0_30px_rgba(255,0,127,0.2)]">
                    <h2 className="text-2xl font-bold mb-2 text-center text-neon-pink">Confirmar Acceso</h2>
                    <p className="text-gray-400 text-sm text-center mb-6">Por seguridad, confirma tu correo electrónico para completar el inicio de sesión.</p>
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="tu@correo.com"
                            value={tempEmail}
                            onChange={(e) => setTempEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-pink outline-none text-white"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neon-pink text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={20} /> : <LogIn size={20} />}
                            Confirmar y Entrar
                        </button>
                    </div>
                    {message && <p className="mt-4 text-center text-sm text-red-500 font-bold">{message}</p>}
                </form>
            </div>
        );
    }

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

                        {/* Current Event Preview */}
                        <div className="mb-6 w-full group relative">
                            <p className="text-[10px] text-neon-pink uppercase font-bold mb-2 tracking-widest opacity-70">
                                {eventsList.length > 0 ? 'Flyer Activo (Firebase)' : 'Flyer por Defecto'}
                            </p>
                            <div className="aspect-[3/4] rounded-lg overflow-hidden border border-neon-pink/30 shadow-[0_0_15px_rgba(255,0,127,0.1)]">
                                <img
                                    src={eventsList.length > 0 ? eventsList[0].url : '/images/jeune.jpeg'}
                                    alt="Evento Actual"
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
                                />
                                {/* Delete Button for Firebase Flyer */}
                                {eventsList.length > 0 && (
                                    <button
                                        onClick={() => handleDelete('events', eventsList[0].id, eventsList[0].url)}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg z-10 transition-transform hover:scale-110"
                                        title="Eliminar este flyer"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>


                        <label className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-white/10 w-full mb-8">
                            <Upload size={16} className="inline mr-2" /> {eventsList.length > 0 ? 'Cambiar Flyer' : 'Subir Flyer'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'events')} />
                        </label>

                        {/* Editable Text Section */}
                        <div className="w-full text-left space-y-4 pt-6 border-t border-white/10">
                            <p className="text-xs font-bold text-gray-500 uppercase">Editar Textos de Eventos</p>
                            <div>
                                <label className="block text-[10px] text-gray-400 uppercase mb-1">Título (Destacado)</label>
                                <input
                                    type="text"
                                    value={eventsInfo.title}
                                    onChange={(e) => setEventsInfo({ ...eventsInfo, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-neon-pink outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 uppercase mb-1">Descripción</label>
                                <textarea
                                    value={eventsInfo.description}
                                    onChange={(e) => setEventsInfo({ ...eventsInfo, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-neon-pink outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 uppercase mb-1">Pie de Página (Ubicación)</label>
                                <input
                                    type="text"
                                    value={eventsInfo.footer}
                                    onChange={(e) => setEventsInfo({ ...eventsInfo, footer: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-neon-pink outline-none"
                                />
                            </div>
                            <button
                                onClick={handleUpdateEventsInfo}
                                disabled={uploading}
                                className="w-full bg-neon-pink/20 hover:bg-neon-pink/40 text-neon-pink font-bold py-2 rounded-lg border border-neon-pink/30 transition-all text-sm disabled:opacity-50"
                            >
                                <RefreshCw size={14} className={`inline mr-2 ${uploading ? 'animate-spin' : ''}`} />
                                Guardar Cambios de Texto
                            </button>
                        </div>
                    </div>

                    {/* Bio Management */}
                    <div className="bg-dark-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center col-span-1 md:col-span-2 lg:col-span-3">
                        <ImageIcon size={48} className="text-neon-pink mb-4" />
                        <h3 className="font-bold mb-2">Biografía y Logros</h3>
                        <p className="text-sm text-gray-400 mb-6">Personaliza tu historia y tus éxitos.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full text-left">
                            {/* Left: Main Bio Text */}
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-500 uppercase">Texto Principal</p>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Título de Bio</label>
                                    <input
                                        type="text"
                                        value={bioInfo.title}
                                        onChange={(e) => setBioInfo({ ...bioInfo, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-neon-pink outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Contenido (Párrafos)</label>
                                    <textarea
                                        value={bioInfo.content}
                                        onChange={(e) => setBioInfo({ ...bioInfo, content: e.target.value })}
                                        rows={8}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-neon-pink outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Right: Highlights Blocks */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Cuadros de Destacados (Logros/Impacto)</p>
                                    <button
                                        onClick={handleAddHighlight}
                                        className="text-[10px] bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink border border-neon-pink/30 px-2 py-1 rounded"
                                    >
                                        + Añadir Cuadro
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {bioInfo.highlights.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl relative group">
                                            <button
                                                onClick={() => handleRemoveHighlight(idx)}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Título"
                                                    value={item.title}
                                                    onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/10 text-xs font-bold text-neon-pink focus:border-neon-pink outline-none pb-1"
                                                />
                                                <select
                                                    value={item.iconType}
                                                    onChange={(e) => handleHighlightChange(idx, 'iconType', e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/10 text-[10px] text-gray-400 outline-none"
                                                >
                                                    <option value="star" className="bg-black">Icono: Estrella (Logros)</option>
                                                    <option value="disc" className="bg-black">Icono: Disco (Impacto)</option>
                                                    <option value="megaphone" className="bg-black">Icono: Megáfono (Anuncio)</option>
                                                </select>
                                                <textarea
                                                    placeholder="Contenido..."
                                                    value={item.content}
                                                    onChange={(e) => handleHighlightChange(idx, 'content', e.target.value)}
                                                    rows={3}
                                                    className="w-full bg-transparent border border-white/5 rounded p-1 text-[10px] text-gray-300 outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateBioInfo}
                            disabled={uploading}
                            className="mt-8 w-full max-w-md bg-neon-pink hover:bg-neon-pink/80 text-black font-black py-3 rounded-xl transition-all uppercase tracking-widest disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={`inline mr-2 ${uploading ? 'animate-spin' : ''}`} />
                            Guardar Toda la Biografía
                        </button>
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

                    {/* Dedicated Carousel Upload */}
                    <div className="bg-dark-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center shadow-lg shadow-neon-pink/10 border-neon-pink/30">
                        <RefreshCw size={48} className="text-neon-pink mb-4" />
                        <h3 className="font-bold mb-2 text-neon-pink">Fotos Carrusel</h3>
                        <p className="text-sm text-gray-400 mb-6 font-bold">Imágenes específicas para el inicio.</p>
                        <label className="bg-neon-pink/20 hover:bg-neon-pink/40 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-neon-pink/30 w-full text-neon-pink font-bold">
                            <Upload size={16} className="inline mr-2" /> Subir al Carrusel
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'carousel')} />
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
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                        <h2 className="text-2xl font-bold text-white">Gestionar Contenido Activo</h2>
                        <button
                            onClick={() => {
                                console.log("Manual refresh requested...");
                                refreshData();
                            }}
                            disabled={loadingData}
                            className="flex items-center gap-2 text-sm bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink px-4 py-2 rounded-full border border-neon-pink/30 transition-all disabled:opacity-50 font-bold"
                        >
                            <RefreshCw size={18} className={loadingData ? "animate-spin" : ""} />
                            {loadingData ? "Cargando datos..." : "ACTUALIZAR LISTAS"}
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

                        {/* Carousel Photos List */}
                        {carouselList.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-neon-pink"><RefreshCw size={20} /> Fotos en Carrusel Principal ({carouselList.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {carouselList.map((item) => (
                                        <div key={item.id} className="relative group bg-dark-card border border-neon-pink/20 rounded-lg overflow-hidden ring-1 ring-neon-pink/10">
                                            <img src={item.url} alt={item.name} className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <button onClick={() => handleDelete('carousel', item.id, item.url)} className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Borrar">
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

                        {!loadingData && carouselList.length === 0 && (
                            <p className="text-center text-gray-500 py-4 bg-white/5 rounded-xl border border-dashed border-white/10">
                                No hay fotos en el carrusel todavía. Sube una arriba en "Fotos Carrusel".
                            </p>
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
