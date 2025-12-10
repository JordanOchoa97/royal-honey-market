// src/presentation/store/cartStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/src/core/domain/entities/Product';

/**
 * 🎯 CART ITEM TYPE
 * 
 * Representa un producto en el carrito con cantidad
 */
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

/**
 * 🎯 CART STATE
 * 
 * Todo el estado del carrito
 */
interface CartState {
  items: CartItem[];
  isOpen: boolean; // Para el drawer del carrito
}

/**
 * 🎯 CART ACTIONS
 * 
 * Todas las acciones posibles con el carrito
 */
interface CartActions {
  // CRUD de items
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed properties (getters)
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  hasItem: (productId: string) => boolean;
  getItem: (productId: string) => CartItem | undefined;
}

/**
 * 🎯 CART STORE TYPE
 * 
 * Combina state y actions
 */
type CartStore = CartState & CartActions;

/**
 * 🎯 ZUSTAND STORE: useCartStore
 * 
 * Sin Immer - manejamos inmutabilidad manualmente
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ============================================
      // 📊 INITIAL STATE
      // ============================================
      items: [],
      isOpen: false,

      // ============================================
      // 🔧 ACTIONS
      // ============================================
      
      /**
       * Agregar producto al carrito
       * Si ya existe, incrementa cantidad
       */
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item => item.product.id.value === product.id.value
          );

          if (existingItemIndex !== -1) {
            // Incrementar cantidad si ya existe
            const newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            };
            return { items: newItems };
          } else {
            // Agregar nuevo item
            return {
              items: [
                ...state.items,
                {
                  product,
                  quantity,
                  addedAt: new Date(),
                },
              ],
            };
          }
        });
      },

      /**
       * Remover producto del carrito
       */
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            item => item.product.id.value !== productId
          ),
        }));
      },

      /**
       * Actualizar cantidad de un producto
       * Si cantidad es 0 o negativa, remover
       */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.product.id.value === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      /**
       * Vaciar carrito completamente
       */
      clearCart: () => {
        set({ items: [] });
      },

      // ============================================
      // 🎨 UI ACTIONS
      // ============================================
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      // ============================================
      // 📊 COMPUTED PROPERTIES (GETTERS)
      // ============================================
      
      /**
       * Total de items en el carrito
       */
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Subtotal (sin impuestos)
       */
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price.amount * item.quantity,
          0
        );
      },

      /**
       * Impuestos (10%)
       */
      getTax: () => {
        return get().getSubtotal() * 0.10;
      },

      /**
       * Total a pagar (subtotal + impuestos)
       */
      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },

      /**
       * Verificar si un producto está en el carrito
       */
      hasItem: (productId) => {
        return get().items.some(item => item.product.id.value === productId);
      },

      /**
       * Obtener un item específico del carrito
       */
      getItem: (productId) => {
        return get().items.find(item => item.product.id.value === productId);
      },
    }),
    {
      name: 'cart-storage', // nombre en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * 🎯 CUSTOM HOOKS CONVENIENTES
 * 
 * Hooks especializados para casos de uso comunes
 */

// Hook para solo obtener items
export const useCartItems = () => useCartStore(state => state.items);

// Hook para solo obtener count
export const useCartCount = () => useCartStore(state => state.getItemCount());

// Hook para totales - Seleccionar cada valor individualmente
export const useCartTotals = () => {
  const subtotal = useCartStore(state => state.getSubtotal());
  const tax = useCartStore(state => state.getTax());
  const total = useCartStore(state => state.getTotal());
  
  return { subtotal, tax, total };
};

// Hook para UI state - Seleccionar cada valor individualmente
export const useCartUI = () => {
  const isOpen = useCartStore(state => state.isOpen);
  const openCart = useCartStore(state => state.openCart);
  const closeCart = useCartStore(state => state.closeCart);
  const toggleCart = useCartStore(state => state.toggleCart);
  
  return { isOpen, openCart, closeCart, toggleCart };
};