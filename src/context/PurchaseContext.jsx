import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";
import { useAuth } from "./useAuth";
const PurchaseContext = createContext();
function toPurchase(p) {
  return {
    id: p.id,
    total: Number(p.total),
    status: p.status,
    date: p.date ?? p.createdAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    items: (p.PurchaseItems ?? []).map((item) => ({
      id: item.id,
      name: item.ModelTridi?.name,
      price: Number(item.unitPrice),
    })),
  };
}
export function PurchaseProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  async function refreshPurchases() {
    if (!isAuthenticated) {
      setPurchases([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await client.get("/purchases");
      console.log("RAW /purchases ->", JSON.stringify(data, null, 2));
      setPurchases(data.map(toPurchase));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
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