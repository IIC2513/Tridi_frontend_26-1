import { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import client from "../api/client";
import { useAuth } from "./useAuth";
import { useStatus } from "./StatusContext";

const CartContext = createContext();

function toCartItem(item) {
  return {
    id: item.id,
    modelId: item.modelId,
    name: item.ModelTridi.name,
    artist: item.ModelTridi.creator?.username ?? "Unknown",
    price: Number(item.ModelTridi.price),
    files: item.ModelTridi.files,
  };
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { showStatus } = useStatus();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const pendingRef = useRef(new Set());

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems]
  );

  async function refreshCart() {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await client.get("/cart");
      setCartItems(data.data.items.map(toCartItem));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(modelId) {
    if (cartItems.some((i) => i.modelId === modelId)) {
      showStatus({ variant: "warning", message: "This model is already in your cart." });
      return;
    }
    if (pendingRef.current.has(modelId)) return;
    pendingRef.current.add(modelId);
    try {
      const res = await client.post("/cart/items", { modelId });
      if (res.status === 200) {
        showStatus({ variant: "warning", message: "This model is already in your cart." });
        return;
      }
      const item = toCartItem(res.data.data);
      setCartItems((prev) =>
        prev.some((i) => i.modelId === item.modelId) ? prev : [...prev, item]
      );
      showStatus({
        variant: "success",
        title: "Added to cart",
        message: `${item.name} added successfully.`,
      });
    } catch (error) {
      console.error(error);
      showStatus({ variant: "error", message: "Couldn't add to cart." });
    } finally {
      pendingRef.current.delete(modelId);
    }
  }

  async function removeFromCart(cartItemId) {
    try {
      await client.delete(`/cart/items/${cartItemId}`);
      setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
      showStatus({ variant: "success", message: "Removed from cart." });
    } catch (error) {
      console.error(error);
      showStatus({ variant: "error", message: "Couldn't remove item." });
    }
  }

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        loading,
        refreshCart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}