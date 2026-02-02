import { useState } from 'react';
import { Play, Instagram, Youtube, User, Music, Menu, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden selection:bg-neon-green selection:text-black">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-tighter hover:text-neon-green transition-colors cursor-pointer">
                SWEET<span className="text-neon-green">JAY</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Inicio', 'Música', 'Videos', 'Bio', 'Contacto'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-neon-green transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white hover:text-neon-green p-2">
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
                    className="block px-3 py-4 rounded-md text-base font-bold uppercase text-center hover:bg-white/5 hover:text-neon-green"
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
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Placeholder for Hero Image - Dark/Neon Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>

          {/* Neon Glow Effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-neon-green tracking-[0.2em] font-medium mb-4 text-sm md:text-base">NUEVO LANZAMIENTO</h2>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-none">
              <span className="block text-white">HOODIE</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              El nuevo sencillo ya disponible en todas las plataformas digitales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://open.spotify.com/artist/3iRxXFhGui4HYHDrhgWgr9"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 bg-neon-green text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105"
              >
                <Play className="fill-current" size={20} />
                Escuchar Ahora
              </a>
              <a
                href="https://www.youtube.com/@Sweetjay312"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-white/20 hover:border-neon-green hover:text-neon-green px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all bg-black/50 backdrop-blur-sm"
              >
                <Youtube size={20} />
                Ver Video
              </a>
            </div>
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
            <div className="w-24 h-1 bg-neon-green mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock Items for now - would be Spotify Embeds */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-black border border-white/5 rounded-xl p-6 hover:border-neon-green/50 transition-colors group">
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <Music className="text-gray-600 group-hover:text-neon-green w-12 h-12 transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Nombre de la Canción</h3>
                <p className="text-gray-400 text-sm">Single • 2025</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="https://open.spotify.com/artist/3iRxXFhGui4HYHDrhgWgr9" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-neon-green hover:text-white transition-colors uppercase font-bold tracking-widest text-sm">
              Ver discografía completa <span className="text-xl">→</span>
            </a>
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
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800">
                {/* Placeholder for Artist Photo */}
                <div className="w-full h-full bg-gradient-to-t from-black to-gray-800 flex items-center justify-center">
                  <User size={64} className="text-white/20" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-neon-green/30 rounded-2xl -z-10"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6">SWEETJAY</h2>
              <h3 className="text-xl text-neon-green font-bold mb-6 uppercase tracking-wider">Desde Colima Para El Mundo</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Directo desde la misteriosa belleza de Colima, envuelta entre playas y volcanes.
                Sweetjay trae una propuesta fresca al género urbano, fusionando ritmos latinos con
                letras que narran la realidad y los sueños de una generación.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                "Repartimos mucho flow con música". Con lanzamientos recientes como "HOODIE" y "El Don",
                está marcando su territorio en la escena musical emergente.
              </p>

              <div className="flex gap-4">
                <a href="https://www.instagram.com/s.weet.jay/" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-neon-green hover:text-black transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="https://www.youtube.com/@Sweetjay312" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-neon-green hover:text-black transition-colors">
                  <Youtube size={24} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-center">
        <p className="text-gray-500">© 2026 Sweetjay Music. Todos los derechos reservados.</p>
        <div className="mt-4 flex justify-center gap-6 opacity-50">
          <Instagram size={20} />
          <Youtube size={20} />
          <Mail size={20} />
        </div>
      </footer>
    </div>
  );
}

export default App;
