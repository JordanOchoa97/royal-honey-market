// src/presentation/providers/ToastProvider.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#1f2937',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          maxWidth: '400px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            border: '2px solid #10b981',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            border: '2px solid #ef4444',
          },
        },
        loading: {
          iconTheme: {
            primary: '#667eea',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}