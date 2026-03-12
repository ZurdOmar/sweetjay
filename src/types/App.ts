/**
 * Tipos e Interfaces para App.tsx
 * 
 * Este archivo contiene todos los tipos utilizados en el componente App.tsx
 * para evitar el uso de `any` y mejorar la seguridad de tipos.
 */

/**
 * Información de configuración de eventos
 */
export interface EventsInfo {
  title: string;
  description: string;
  footer: string;
  isVisible?: boolean;
}

/**
 * Información de configuración de conciertos
 */
export interface ConcertsInfo {
  title: string;
  description: string;
  isVisible?: boolean;
}

/**
 * Elemento destacado de la biografía (Logros/Impacto)
 */
export interface BioHighlight {
  title: string;
  content: string;
  iconType: 'star' | 'disc' | 'megaphone';
}

/**
 * Información completa de la biografía
 */
export interface BioInfo {
  title: string;
  content: string;
  highlights: BioHighlight[];
}

/**
 * Imagen de la galería
 */
export interface GalleryImage {
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Video de YouTube o local
 */
export interface Video {
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Concierto (video local)
 */
export interface Concert {
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Evento próximo
 */
export interface AppEvent {
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Canción de música
 */
export interface MusicTrack {
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Anuncio publicitario
 */
export interface Ad {
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Promoción (modal emergente)
 */
export interface Promotion {
  url: string;
  link?: string;
  name?: string;
  createdAt?: number | { seconds: number };
  id?: string;
}

/**
 * Estado del formulario de contacto
 */
export type ContactStatus = '' | 'loading' | 'success' | 'error';

/**
 * Datos completos del estado de la aplicación
 */
export interface AppState {
  // UI State
  isMenuOpen: boolean;
  
  // Formulario de contacto
  contactName: string;
  contactEmail: string;
  contactMessage: string;
  contactStatus: ContactStatus;
  
  // Datos de Firebase
  galleryImages: GalleryImage[];
  firebaseVideos: Video[];
  firebaseConcerts: Concert[];
  firebaseEvents: Event[];
  firebaseMusic: MusicTrack[];
  firebaseAds: Ad[];
  
  // Configuración
  firebaseEventsInfo: EventsInfo;
  firebaseConcertsInfo: ConcertsInfo;
  firebaseBioInfo: BioInfo;
  
  // Promociones
  activePromotion: Promotion | null;
  showAd: boolean;
}
