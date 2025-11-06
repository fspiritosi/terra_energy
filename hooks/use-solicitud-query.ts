"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseSolicitudQuery {
  solicitudNumber: string | null;
  clearQuery: () => void;
  isFromQuery: boolean;
  setQuery: (solicitudNumber: string) => void;
}

export function useSolicitudQuery(): UseSolicitudQuery {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFromQuery, setIsFromQuery] = useState(false);

  // Obtener el número de solicitud del query parameter
  const solicitudNumber = searchParams.get("review");

  // Marcar si la solicitud viene de query parameter
  useEffect(() => {
    if (solicitudNumber) {
      setIsFromQuery(true);
    }
  }, [solicitudNumber]);

  // Función para limpiar el query parameter
  const clearQuery = useCallback(() => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("review");

    // Actualizar URL sin recargar la página
    router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
    setIsFromQuery(false);
  }, [router]);

  // Función para establecer un query parameter
  const setQuery = useCallback(
    (solicitudNumber: string) => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("review", solicitudNumber);

      // Actualizar URL sin recargar la página
      router.push(currentUrl.pathname + currentUrl.search, { scroll: false });
      setIsFromQuery(true);
    },
    [router]
  );

  return {
    solicitudNumber,
    clearQuery,
    isFromQuery,
    setQuery,
  };
}

// Función utilitaria para validar formato de número de solicitud
export function validateSolicitudNumber(solicitudNumber: string): boolean {
  // Formato esperado: SOL-XXXX-XXX (ej: SOL-CDSC-005)
  const solicitudPattern = /^SOL-[A-Z]{4}-\d{3}$/;
  return solicitudPattern.test(solicitudNumber);
}

// Función utilitaria para sanitizar query parameters
export function sanitizeSolicitudNumber(
  solicitudNumber: string
): string | null {
  if (!solicitudNumber || typeof solicitudNumber !== "string") {
    return null;
  }

  // Remover caracteres peligrosos y espacios
  const sanitized = solicitudNumber.trim().replace(/[<>\"'&]/g, "");

  // Validar formato
  if (!validateSolicitudNumber(sanitized)) {
    return null;
  }

  return sanitized;
}
