// src/presentation/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

/**
 * 🎯 CUSTOM HOOK: useDebounce
 * 
 * CONCEPTO: DEBOUNCING
 * 
 * Problema: Si el usuario escribe "honey", no queremos hacer 5 requests:
 * - "h"
 * - "ho"
 * - "hon"
 * - "hone"
 * - "honey"
 * 
 * Solución: Esperamos que el usuario termine de escribir (delay)
 * Solo enviamos el request cuando pasa X tiempo sin cambios
 * 
 * VENTAJAS:
 * - Reduce requests al servidor
 * - Mejor UX (no spam de resultados cambiando)
 * - Ahorro de recursos
 * 
 * @param value - Valor a debouncer
 * @param delay - Milisegundos de espera (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear un timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Si value cambia antes del delay, cancelar el timer anterior
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}