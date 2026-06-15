import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'tomato.cart';

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  restaurantId: number | null;
  restaurantName: string | null;
  items: CartItem[];
}

const EMPTY_CART: CartState = { restaurantId: null, restaurantName: null, items: [] };

export type AddItemResult = 'added' | 'conflict';

interface CartContextValue extends CartState {
  addItem: (restaurantId: number, restaurantName: string, item: Omit<CartItem, 'quantity'>) => AddItemResult;
  replaceCart: (restaurantId: number, restaurantName: string, item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed.restaurantId || !Array.isArray(parsed.items)) return EMPTY_CART;
    return parsed;
  } catch {
    return EMPTY_CART;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => loadCart());

  useEffect(() => {
    if (cart.restaurantId === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const addItem = (
    restaurantId: number,
    restaurantName: string,
    item: Omit<CartItem, 'quantity'>
  ): AddItemResult => {
    if (cart.restaurantId !== null && cart.restaurantId !== restaurantId && cart.items.length > 0) {
      return 'conflict';
    }
    setCart((prev) => addOrIncrement(prev, restaurantId, restaurantName, item));
    return 'added';
  };

  const replaceCart = (restaurantId: number, restaurantName: string, item: Omit<CartItem, 'quantity'>) => {
    setCart(addOrIncrement(EMPTY_CART, restaurantId, restaurantName, item));
  };

  const removeItem = (menuItemId: number) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.menuItemId !== menuItemId);
      return items.length === 0 ? EMPTY_CART : { ...prev, items };
    });
  };

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i)),
    }));
  };

  const clearCart = () => setCart(EMPTY_CART);

  const subtotal = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart.items]
  );

  const value: CartContextValue = {
    ...cart,
    addItem,
    replaceCart,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function addOrIncrement(
  cart: CartState,
  restaurantId: number,
  restaurantName: string,
  item: Omit<CartItem, 'quantity'>
): CartState {
  const existing = cart.items.find((i) => i.menuItemId === item.menuItemId);
  const items = existing
    ? cart.items.map((i) => (i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i))
    : [...cart.items, { ...item, quantity: 1 }];

  return { restaurantId, restaurantName, items };
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within a CartProvider');
  return ctx;
}
