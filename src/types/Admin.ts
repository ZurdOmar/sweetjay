/**
 * Tipos e Interfaces para Admin.tsx
 * 
 * Este archivo contiene todos los tipos utilizados en el componente Admin.tsx
 * para evitar el uso de `any` y mejorar la seguridad de tipos.
 */

/**
 * Usuario autenticado
 */
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified: boolean;
}

/**
 * Imagen en la galería o carousel
 */
export interface ImageItem {
  id: string;
  url: string;
  name?: string;
  order?: number;
  createdAt?: number | { seconds: number };
}

/**
 * Canción de música
 */
export interface MusicItem {
  id: string;
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Evento próximo
 */
export interface EventItem {
  id: string;
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Video (YouTube o local)
 */
export interface VideoItem {
  id: string;
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Concierto (video local)
 */
export interface ConcertItem {
  id: string;
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Anuncio publicitario
 */
export interface AdItem {
  id: string;
  url: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Promoción (modal emergente)
 */
export interface PromotionItem {
  id: string;
  url: string;
  link?: string;
  name?: string;
  createdAt?: number | { seconds: number };
}

/**
 * Mensaje de contacto
 */
export interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number | string;
}

/**
 * Elemento destacado de la biografía
 */
export interface BioHighlight {
  title: string;
  content: string;
  iconType: 'star' | 'disc' | 'megaphone';
}

/**
 * Información de la biografía
 */
export interface BioInfo {
  title: string;
  content: string;
  highlights: BioHighlight[];
}

/**
 * Información de eventos
 */
export interface EventsInfo {
  title: string;
  description: string;
  footer: string;
  isVisible?: boolean;
}

/**
 * Información de conciertos
 */
export interface ConcertsInfo {
  title: string;
  description: string;
  isVisible?: boolean;
}

/**
 * Estado completo del Admin
 */
export interface AdminState {
  // Autenticación
  user: User | null;
  email: string;
  loading: boolean;
  uploading: boolean;
  progress: number;
  message: string;
  
  // Login
  youtubeLink: string;
  loadingData: boolean;
  confirmEmailNeeded: boolean;
  tempEmail: string;
  
  // Listas de contenido
  imagesList: ImageItem[];
  carouselList: ImageItem[];
  musicList: MusicItem[];
  eventsList: EventItem[];
  videosList: VideoItem[];
  concertsList: ConcertItem[];
  adsList: AdItem[];
  promotionsList: PromotionItem[];
  messagesList: MessageItem[];
  
  // Configuración
  activePromoId: string | null;
  activeMusicId: string | null;
  eventsInfo: EventsInfo;
  concertsInfo: ConcertsInfo;
  bioInfo: BioInfo;
}

/**
 * Props para funciones de upload
 */
export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
}
