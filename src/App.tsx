import { useState, useRef } from 'react';
import { Instagram, Youtube, Music, Menu, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroCarousel } from './components/HeroCarousel';
import { MusicPlayer } from './components/MusicPlayer';
import type { MusicPlayerHandle } from './components/MusicPlayer';
import { Intro } from './components/Intro';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleEnter = () => {
    setShowIntro(false);
    // Give a tiny delay for the click to be registered as an "activation gesture"
    setTimeout(() => {
      musicPlayerRef.current?.forcePlay();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden selection:bg-neon-green selection:text-black">
      <AnimatePresence>
        {showIntro && <Intro onEnter={handleEnter} />}
      </AnimatePresence>

      <MusicPlayer ref={musicPlayerRef} />

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex-shrink-0">
              <img
                src="/images/sweetj-2.png"
                alt="Sweet J Logo"
                className="h-20 w-auto object-contain cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,0,127,0.6)] transition-all"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Inicio', 'Música', 'Videos', 'Bio', 'Contacto'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-neon-pink transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white hover:text-neon-pink p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black border-b border-white/10"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {['Inicio', 'Música', 'Videos', 'Bio', 'Contacto'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-4 rounded-md text-base font-bold uppercase text-center hover:bg-white/5 hover:text-neon-pink"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          {/* Background - User Image */}
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-[70%_center] bg-no-repeat opacity-60"></div>

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>

          {/* Neon Glow Effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neon-pink/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-4xl px-4">

          {/* 1. Dynamic Carousel (Replaces static photo) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full flex justify-center"
          >
            <HeroCarousel />
          </motion.div>

          {/* 2. Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <a
              href="https://open.spotify.com/artist/3iRxXFhGui4HYHDrhgWgr9"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-[#1DB954] text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all transform hover:scale-105 shadow-lg"
            >
              <Music className="fill-current" size={20} />
              Spotify
            </a>
            <a
              href="https://www.youtube.com/@Sweetjay312"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-[#FF0000] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-[#FF0000] transition-all transform hover:scale-105 shadow-lg"
            >
              <Youtube className="fill-current" size={20} />
              YouTube
            </a>
            <a
              href="https://www.instagram.com/s.weet.jay/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              <Instagram size={20} />
              Instagram
            </a>
          </motion.div>
        </div>
      </section>

      {/* Music Section */}
      <section id="música" className="py-24 bg-dark-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">MÚSICA</h2>
            <div className="w-24 h-1 bg-neon-pink mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'HOODIE', year: '2025', image: '/images/slide1.png' },
              { title: 'EN MOVIMIENTO', year: '2024', image: '/images/slide2.png' },
              { title: 'EL DON', year: '2024', image: '/images/slide3.png' }
            ].map((song, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black border border-white/5 rounded-xl p-6 hover:border-neon-pink/50 transition-colors group"
              >
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 relative overflow-hidden">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                    <Music className="text-white group-hover:text-neon-pink w-12 h-12 transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{song.title}</h3>
                <p className="text-gray-400 text-sm">Single • {song.year}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="https://open.spotify.com/artist/3iRxXFhGui4HYHDrhgWgr9" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-neon-pink hover:text-white transition-colors uppercase font-bold tracking-widest text-sm">
              Ver discografía completa <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">VIDEOS</h2>
            <div className="w-24 h-1 bg-neon-pink mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/videoseries?list=UU7-K-p6-4X8b-bX-P-X-U-A"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4 text-neon-pink uppercase">Visuals & Estética</h3>
              <p className="text-gray-300 text-lg mb-6">
                Descubre el universo visual de Sweetjay. Cada video es una pieza que complementa el ritmo y la lírica,
                llevando la experiencia musical a otro nivel sensorial.
              </p>
              <a
                href="https://www.youtube.com/@Sweetjay312"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-neon-pink transition-all self-start"
              >
                Suscribirse en YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-neon">
                <img
                  src="/images/artist.png"
                  alt="Sweetjay"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-neon-pink/30 rounded-2xl -z-10"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/images/sweetj-2.png" alt="Sweet J" className="w-64 h-auto mb-6" />
              <h3 className="text-xl text-white font-bold mb-6 uppercase tracking-wider">Desde Colima Para El Mundo</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Originario de Colima, con 25 años de edad, SweetJ es un apasionado de la música y la expresión artística.
                Debuta en octubre de 2023 con su EP "MY ESSENCE", marcando el inicio de una carrera enfocada en
                expresar sentimientos a través de melodías urbanas frescas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h4 className="text-neon-pink font-bold text-sm mb-2 uppercase">Highlights</h4>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li>• Colaboración "Dos Locos" - Grupo Cañaveral</li>
                    <li>• Ranking Top #10 Radio 91.7</li>
                    <li>• Miembro fundador de Flow312</li>
                    <li>• Especial con Armando Gómez (Latin Grammy)</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h4 className="text-neon-pink font-bold text-sm mb-2 uppercase">Proyectos</h4>
                  <p className="text-gray-400 text-sm">
                    Gestor activo del talento local colimense y organizador de eventos urbanos masivos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <a href="https://www.instagram.com/s.weet.jay/" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-neon-pink hover:text-black transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="https://www.youtube.com/@Sweetjay312" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-neon-pink hover:text-black transition-colors">
                  <Youtube size={24} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-dark-card border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-black mb-6 uppercase">Contacto</h2>
              <p className="text-gray-400 text-lg mb-8">
                ¿Interesado en una colaboración, booking o prensa? Ponte en contacto directamente con mi equipo.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/5 rounded-xl text-neon-green">
                    <Mail size={24} className="text-neon-pink" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase text-gray-400">Email</h4>
                    <p className="text-lg">booking@sweetjay.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/5 rounded-xl text-neon-green">
                    <Instagram size={24} className="text-neon-pink" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase text-gray-400">Directo</h4>
                    <p className="text-lg">@s.weet.jay</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="bg-black/50 p-8 rounded-2xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Nombre</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-pink transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-pink transition-colors" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Mensaje</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-pink transition-colors"></textarea>
              </div>
              <button type="submit" className="w-full bg-neon-pink text-black font-black uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-all">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-center flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-2 font-bold opacity-80">Desarrollado por</p>
          <img
            src="/images/Logo-zotek_animado.svg"
            alt="Zotek Logo"
            className="h-12 w-auto animate-pulse brightness-110"
          />
        </div>
        <p className="text-gray-500">© 2026 Sweetjay Music. Todos los derechos reservados.</p>
        <div className="mt-4 flex justify-center gap-6 opacity-50">
          <Instagram size={20} className="hover:text-neon-pink transition-colors cursor-pointer" />
          <Youtube size={20} className="hover:text-neon-pink transition-colors cursor-pointer" />
          <Mail size={20} className="hover:text-neon-pink transition-colors cursor-pointer" />
        </div>
      </footer>
    </div>
  );
} export default App;
