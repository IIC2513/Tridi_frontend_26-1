import { createContext, useContext, useState, useEffect, useCallback } from "react";
import client from "../api/client";
import { useAuth } from "./useAuth";
const PurchaseContext = createContext();
function toPurchase(p) {
  const items = (p.PurchaseItems ?? []).map((item) => ({
    id: item.id,
    name: item.ModelTridi?.name,
    price: Number(item.unitPrice),
    modelId: item.ModelTridi?.id,
  }));
  return {
    id: p.id,
    total: Number(p.total),
    status: p.status,
    date: p.date ?? p.createdAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    items,
    PurchaseItems: items, // keep for backward compatibility with PurchaseView fallback
  };
}
export function PurchaseProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshPurchases = useCallback(async () => {
    if (!isAuthenticated) {
      setPurchases([]);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await client.get("/purchases");
      console.log("RAW /purchases ->", JSON.stringify(data, null, 2));
      setPurchases(data.map(toPurchase));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to load purchases");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  async function createPurchase() {
    const { data } = await client.post("/purchases");
    await refreshPurchases();
    return data;
  }
  async function getPurchase(id) {
    const { data } = await client.get(`/purchases/${id}`);
    return data;
  }
  async function updateStatus(purchaseId, status) {
    const { data } = await client.patch(
      `/purchases/${purchaseId}/status`,
      { status }
    );
    await refreshPurchases();
    return data;
  }
  useEffect(() => {
    refreshPurchases();
  }, [isAuthenticated]);
  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        loading,
        error,
        refreshPurchases,
        createPurchase,
        getPurchase,
        updateStatus,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}
export function usePurchases() {
  return useContext(PurchaseContext);
}