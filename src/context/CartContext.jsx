import {createContext, useContext, useState, useEffect} from "react";
import client from "../api/client";
import { useAuth } from "./useAuth";

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

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(false);

    async function refreshCart() {
        if (!isAuthenticated) {
            setCartItems([]);
            setSubtotal(0);
            return;
        }

        try {
            setLoading(true);
            const { data } = await client.get("/cart");

            setCartItems(data.data.items.map(toCartItem));
            setSubtotal(data.data.subtotal);

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    }

    async function addToCart(modelId) {
        await client.post("/cart/items",{ modelId });
        await refreshCart();
    }

    async function removeFromCart(cartItemId) {
        await client.delete(
            `/cart/items/${cartItemId}`
        );

        await refreshCart();
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