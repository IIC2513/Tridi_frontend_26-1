import client from "./client";
 
export const getCart = () =>
    client.get("/cart").then((r) => r.data);
 
export const addCartItem = (modelId) =>
    client.post("/cart/items", { modelId }).then((r) => r.data);
 
export const removeCartItem = (itemId) =>
    client.delete(`/cart/items/${itemId}`).then((r) => r.data);
 
