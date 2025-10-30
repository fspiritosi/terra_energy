"use client";

import { useState, useEffect } from "react";
import {
  getClienteIdFromUser,
  getClienteInfoFromUser,
} from "@/components/solicitudes/components/actions";

export function useUserCliente() {
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClienteId = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const id = await getClienteIdFromUser();
        setClienteId(id);
      } catch (err) {
        console.error("Error fetching cliente ID:", err);
        setError("Error al obtener el cliente del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClienteId();
  }, []);

  return { clienteId, isLoading, error };
}

export function useUserClienteInfo() {
  const [clienteInfo, setClienteInfo] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClienteInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const info = await getClienteInfoFromUser();
        setClienteInfo(info);
      } catch (err) {
        console.error("Error fetching cliente info:", err);
        setError("Error al obtener la información del cliente");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClienteInfo();
  }, []);

  return { clienteInfo, isLoading, error };
}
