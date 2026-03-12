/**
 * Utilidades de Validación para Sweetjay
 * 
 * Funciones para validar y sanitizar datos de Firebase
 * antes de usarlos en la aplicación.
 */

import type { User } from '../types/Admin';
import type {
  GalleryImage,
  Video,
  Concert,
  AppEvent,
  MusicTrack,
  Ad,
  Promotion,
  EventsInfo,
  ConcertsInfo,
  BioInfo
} from '../types/App';

/**
 * Valida que un objeto sea un User válido
 */
export function validateUser(data: unknown): User {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de usuario inválidos: no es un objeto');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.uid !== 'string' || !obj.uid) {
    throw new Error('Datos de usuario inválidos: uid requerido');
  }

  if (obj.email !== null && typeof obj.email !== 'string') {
    throw new Error('Datos de usuario inválidos: email debe ser string o null');
  }

  if (typeof obj.emailVerified !== 'boolean') {
    throw new Error('Datos de usuario inválidos: emailVerified requerido');
  }

  return {
    uid: obj.uid,
    email: obj.email || null,
    emailVerified: obj.emailVerified,
    displayName: typeof obj.displayName === 'string' ? obj.displayName : null,
    photoURL: typeof obj.photoURL === 'string' ? obj.photoURL : null,
  };
}

/**
 * Valida y sanitiza una imagen de galería
 */
export function validateGalleryImage(data: unknown): GalleryImage {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de imagen inválidos');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.url !== 'string' || !obj.url) {
    throw new Error('Imagen inválida: url requerida');
  }

  // Validar que la URL sea segura (https o relativa)
  if (obj.url.startsWith('http') && !obj.url.startsWith('https')) {
    console.warn('URL insegura detectada:', obj.url);
  }

  return {
    url: obj.url,
    name: typeof obj.name === 'string' ? obj.name : undefined,
    createdAt: obj.createdAt as number | { seconds: number } | undefined,
  };
}

/**
 * Valida un video
 */
export function validateVideo(data: unknown): Video {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de video inválidos');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.url !== 'string' || !obj.url) {
    throw new Error('Video inválido: url requerida');
  }

  return {
    url: obj.url,
    name: typeof obj.name === 'string' ? obj.name : undefined,
    createdAt: obj.createdAt as number | { seconds: number } | undefined,
  };
}

/**
 * Valida un concierto
 */
export function validateConcert(data: unknown): Concert {
  return validateVideo(data) as Concert;
}

/**
 * Valida un evento
 */
export function validateEvent(data: unknown): AppEvent {
  return validateVideo(data) as AppEvent;
}

/**
 * Valida una canción
 */
export function validateMusicTrack(data: unknown): MusicTrack {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de canción inválidos');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.url !== 'string' || !obj.url) {
    throw new Error('Canción inválida: url requerida');
  }

  return {
    url: obj.url,
    name: typeof obj.name === 'string' ? obj.name : undefined,
    createdAt: obj.createdAt as number | { seconds: number } | undefined,
  };
}

/**
 * Valida un anuncio
 */
export function validateAd(data: unknown): Ad {
  return validateMusicTrack(data) as Ad;
}

/**
 * Valida una promoción
 */
export function validatePromotion(data: unknown): Promotion {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de promoción inválidos');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.url !== 'string' || !obj.url) {
    throw new Error('Promoción inválida: url requerida');
  }

  return {
    url: obj.url,
    link: typeof obj.link === 'string' ? obj.link : undefined,
    name: typeof obj.name === 'string' ? obj.name : undefined,
    createdAt: obj.createdAt as number | { seconds: number } | undefined,
    id: typeof obj.id === 'string' ? obj.id : undefined,
  };
}

/**
 * Sanitiza un string para prevenir XSS
 * Elimina tags HTML y caracteres peligrosos
 */
export function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') {
    return '';
  }

  // Eliminar tags HTML
  const withoutTags = str.replace(/<[^>]*>/g, '');
  
  // Eliminar caracteres peligrosos
  const sanitized = withoutTags
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<script>/gi, '')
    .replace(/<\/script>/gi, '');

  return sanitized.trim();
}

/**
 * Valida información de eventos
 */
export function validateEventsInfo(data: unknown): EventsInfo {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de eventos inválidos');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== 'string') {
    throw new Error('Eventos inválidos: title requerido');
  }

  if (typeof obj.description !== 'string') {
    throw new Error('Eventos inválidos: description requerido');
  }

  if (typeof obj.footer !== 'string') {
    throw new Error('Eventos inválidos: footer requerido');
  }

  return {
    title: sanitizeString(obj.title),
    description: sanitizeString(obj.description),
    footer: sanitizeString(obj.footer),
    isVisible: typeof obj.isVisible === 'boolean' ? obj.isVisible : undefined,
  };
}

/**
 * Valida información de conciertos
 */
export function validateConcertsInfo(data: unknown): ConcertsInfo {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de conciertos inválidos');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== 'string') {
    throw new Error('Conciertos inválidos: title requerido');
  }

  if (typeof obj.description !== 'string') {
    throw new Error('Conciertos inválidos: description requerido');
  }

  return {
    title: sanitizeString(obj.title),
    description: sanitizeString(obj.description),
    isVisible: typeof obj.isVisible === 'boolean' ? obj.isVisible : undefined,
  };
}

/**
 * Valida información de biografía
 */
export function validateBioInfo(data: unknown): BioInfo {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Datos de biografía inválidos');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== 'string') {
    throw new Error('Biografía inválida: title requerido');
  }

  if (typeof obj.content !== 'string') {
    throw new Error('Biografía inválida: content requerido');
  }

  return {
    title: sanitizeString(obj.title),
    content: sanitizeString(obj.content),
    highlights: Array.isArray(obj.highlights) ? obj.highlights as BioInfo['highlights'] : [],
  };
}

/**
 * Logger condicional (solo en desarrollo)
 * Reemplaza console.log para no exponer datos en producción
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info(...args);
    }
  },
};
