import client from "./client";
 
export const listCards = () =>
    client.get("/cards").then((r) => r.data);
 
export const addCard = (payload) =>
    client.post("/cards", payload).then((r) => r.data);
 
export const removeCard = (id) =>
    client.delete(`/cards/${id}`).then((r) => r.data);
 
