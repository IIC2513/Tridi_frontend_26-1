import client from "./client";

export const createPurchase = () =>
    client.post("/purchases").then((r) => r.data);

export const listPurchases = () =>
    client.get("/purchases").then((r) => r.data);

export const getPurchase = (id) =>
    client.get(`/purchases/${id}`).then((r) => r.data);

export const transitionPurchase = (id, status) =>
    client.patch(`/purchases/${id}/status`, { status }).then((r) => r.data);

export const payPurchase = (id, cardId) =>
    client.post(`/purchases/${id}/pay`, { cardId }).then((r) => r.data);