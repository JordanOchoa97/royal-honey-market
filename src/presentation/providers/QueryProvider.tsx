// src/presentation/providers/QueryProvider.tsx

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

/**
 * 🎯 PROVIDER: React Query
 * 
 * CONCEPTOS:
 * 
 * 1. PROVIDER PATTERN
 *    - Envuelve la app con contexto de React Query
 *    - Todos los hijos pueden usar useQuery, useMutation, etc.
 * 
 * 2. CLIENT-SIDE STATE
 *    - QueryClient se crea en el cliente
 *    - Mantiene cache de queries
 * 
 * 3. DEVTOOLS
 *    - Solo en desarrollo
 *    - Visualiza queries, cache, mutations
 */

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // 🎯 useState para crear QueryClient una sola vez
  // Si lo creamos directamente, se recrearía en cada render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 🔄 Refetch cuando la ventana recupera el foco
            refetchOnWindowFocus: false,
            
            // 🔄 Refetch cuando se reconecta a internet
            refetchOnReconnect: true,
            
            // ⏱️ Tiempo antes de considerar datos obsoletos (5 min)
            staleTime: 5 * 60 * 1000,
            
            // 🗑️ Tiempo en cache después de no usarse (10 min)
            gcTime: 10 * 60 * 1000,
            
            // 🔁 Reintentar en caso de error
            retry: 2,
            
            // ⏳ Delay entre reintentos (exponencial)
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 🛠️ DevTools solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}