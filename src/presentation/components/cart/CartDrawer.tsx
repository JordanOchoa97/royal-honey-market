'use client';

import styled from 'styled-components';
import { useCartStore, useCartItems, useCartTotals, useCartUI } from '@/src/presentation/store/cartStore';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
`;

const DrawerContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 450px;
  background: white;
  z-index: 1000;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const DrawerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.25rem;

  &:hover {
    background: #e5e7eb;
  }
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;

  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }

  p {
    margin-bottom: 1.5rem;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
`;

const ItemImage = styled.div<{ $category: string }>`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 0.75rem;
  text-align: center;
  padding: 0.5rem;

  ${({ $category }) => {
    const gradients: Record<string, string> = {
      'raw-honey': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'flavored-honey': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      'honeycomb': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      'bee-products': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'skincare': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      'supplements': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    };
    return `background: ${gradients[$category] || gradients['raw-honey']};`;
  }}
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
`;

const ItemPrice = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #f59e0b;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 700;
  color: #6b7280;

  &:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
  color: #1f2937;
`;

const RemoveButton = styled.button`
  margin-left: auto;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.25rem;

  &:hover {
    color: #dc2626;
  }
`;

const DrawerFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const TotalLabel = styled.span``;

const TotalValue = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const CartDrawer = () => {
  const router = useRouter();
  const items = useCartItems();
  const { subtotal, tax, total } = useCartTotals();
  const { isOpen, closeCart } = useCartUI();
  const { updateQuantity, removeItem, clearCart } = useCartStore();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    router.push('/products');
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={closeCart} />
      
      <DrawerContainer $isOpen={isOpen}>
        <DrawerHeader>
          <DrawerTitle>
            🛒 Shopping Cart ({items.length})
          </DrawerTitle>
          <CloseButton onClick={closeCart}>✕</CloseButton>
        </DrawerHeader>

        <DrawerBody>
          {items.length === 0 ? (
            <EmptyCart>
              <h3>Your cart is empty</h3>
              <p>Add some delicious honey products!</p>
              <Button onClick={handleContinueShopping}>
                Browse Products
              </Button>
            </EmptyCart>
          ) : (
            <CartItems>
              {items.map(item => (
                <CartItem key={item.product.id.value}>
                  <ItemImage $category={item.product.category}>
                    {item.product.name.split(' ').slice(0, 2).join(' ')}
                  </ItemImage>

                  <ItemInfo>
                    <ItemName>{item.product.name}</ItemName>
                    <ItemPrice>
                      ${item.product.price.amount.toFixed(2)}
                    </ItemPrice>
                    
                    <QuantityControls>
                      <QuantityButton
                        onClick={() => updateQuantity(item.product.id.value, item.quantity - 1)}
                      >
                        −
                      </QuantityButton>
                      <Quantity>{item.quantity}</Quantity>
                      <QuantityButton
                        onClick={() => updateQuantity(item.product.id.value, item.quantity + 1)}
                      >
                        +
                      </QuantityButton>
                    </QuantityControls>
                  </ItemInfo>

                  <RemoveButton
                    onClick={() => removeItem(item.product.id.value)}
                    title="Remove from cart"
                  >
                    🗑️
                  </RemoveButton>
                </CartItem>
              ))}
            </CartItems>
          )}
        </DrawerBody>

        {items.length > 0 && (
          <DrawerFooter>
            <TotalRow>
              <TotalLabel>Subtotal:</TotalLabel>
              <TotalValue>${subtotal.toFixed(2)}</TotalValue>
            </TotalRow>
            <TotalRow>
              <TotalLabel>Tax (10%):</TotalLabel>
              <TotalValue>${tax.toFixed(2)}</TotalValue>
            </TotalRow>
            <GrandTotal>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </GrandTotal>

            <ActionButtons>
              <Button size="lg" fullWidth onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              <Button size="lg" variant="outline" fullWidth onClick={clearCart}>
                Clear Cart
              </Button>
            </ActionButtons>
          </DrawerFooter>
        )}
      </DrawerContainer>
    </>
  );
};