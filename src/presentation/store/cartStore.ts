import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/src/core/domain/entities/Product';
import toast from 'react-hot-toast';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  hasItem: (productId: string) => boolean;
  getItem: (productId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item => item.product.id.value === product.id.value
          );

          if (existingItemIndex !== -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            };
            
            toast.success(`${product.name} quantity updated!`, {
              icon: '🛒',
              duration: 2000,
            });
            
            return { items: newItems };
          }

          toast.success(`${product.name} added to cart!`, {
            icon: '🛒',
            duration: 2000,
          });

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
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const item = state.items.find(i => i.product.id.value === productId);
          if (item) {
            toast.success(`${item.product.name} removed from cart`, {
              icon: '🗑️',
              duration: 2000,
            });
          }
          return {
            items: state.items.filter(item => item.product.id.value !== productId),
          };
        });
      },

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

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price.amount * item.quantity,
          0
        );
      },

      getTax: () => {
        return get().getSubtotal() * 0.10;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },

      hasItem: (productId) => {
        return get().items.some(item => item.product.id.value === productId);
      },

      getItem: (productId) => {
        return get().items.find(item => item.product.id.value === productId);
      },
    }),
    {
      name: 'royal-honey-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCartItems = () => useCartStore(state => state.items);

export const useCartCount = () => useCartStore(state => state.getItemCount());

export const useCartTotals = () => {
  const subtotal = useCartStore(state => state.getSubtotal());
  const tax = useCartStore(state => state.getTax());
  const total = useCartStore(state => state.getTotal());
  
  return { subtotal, tax, total };
};

export const useCartUI = () => {
  const isOpen = useCartStore(state => state.isOpen);
  const openCart = useCartStore(state => state.openCart);
  const closeCart = useCartStore(state => state.closeCart);
  const toggleCart = useCartStore(state => state.toggleCart);
  
  return { isOpen, openCart, closeCart, toggleCart };
};