import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Parsea una fecha DATE (YYYY-MM-DD) como fecha local en Argentina
 * Evita problemas de conversión UTC que pueden agregar/quitar un día
 */
export function parseDateArgentina(dateString: string): moment.Moment {
  // Si la fecha ya tiene información de hora (TIMESTAMP), parsearla directamente
  if (dateString.includes('T') || dateString.includes(' ')) {
    return moment.tz(dateString, TIMEZONE_ARGENTINA);
  }
  // Si es solo fecha (DATE), agregar hora 00:00:00 y parsearla como local en Argentina
  return moment.tz(dateString + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss', TIMEZONE_ARGENTINA);
}
