// src/presentation/hooks/useToast.ts
import toast from 'react-hot-toast';

export function useToast() {
  return {
    success: (message: string) => {
      toast.success(message, {
        id: message, // Previene duplicados
      });
    },
    
    error: (message: string) => {
      toast.error(message, {
        id: message,
      });
    },
    
    loading: (message: string) => {
      return toast.loading(message);
    },
    
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      return toast.promise(promise, messages);
    },

    dismiss: (toastId?: string) => {
      toast.dismiss(toastId);
    },

    // Toasts personalizados para e-commerce
    addedToCart: (productName: string) => {
      toast.success(`${productName} added to cart!`, {
        icon: '🛒',
        duration: 2000,
      });
    },

    removedFromCart: (productName: string) => {
      toast.success(`${productName} removed from cart`, {
        icon: '🗑️',
        duration: 2000,
      });
    },

    outOfStock: () => {
      toast.error('Sorry, this product is out of stock', {
        icon: '📦',
      });
    },

    subscribed: () => {
      toast.success('Successfully subscribed to newsletter!', {
        icon: '📧',
        duration: 3000,
      });
    },
  };
}