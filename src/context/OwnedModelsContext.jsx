import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./useAuth";
import { getCreatedModels, getPurchasedItems } from "../api/models";

const OwnedModelsContext = createContext(null);

export function OwnedModelsProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    setLoading(true);
    try {
      const [created, purchased] = await Promise.all([
        getCreatedModels(user.id),
        getPurchasedItems(user.id),
      ]);
      const ids = new Set();
      for (const m of created) ids.add(m.id);
      for (const m of purchased) ids.add(m.id);
      setOwnedIds(ids);
    } catch (err) {
      console.error("OwnedModels: failed to fetch", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refresh();
    } else {
      setOwnedIds(new Set());
    }
  }, [isAuthenticated, user?.id, refresh]);

  const isOwned = useCallback((modelId) => ownedIds.has(modelId), [ownedIds]);

  const value = useMemo(
    () => ({ ownedIds, isOwned, loading, refresh }),
    [ownedIds, isOwned, loading, refresh],
  );

  return (
    <OwnedModelsContext.Provider value={value}>
      {children}
    </OwnedModelsContext.Provider>
  );
}

export function useOwnedModels() {
  const ctx = useContext(OwnedModelsContext);
  if (!ctx) throw new Error("useOwnedModels must be used within OwnedModelsProvider");
  return ctx;
}
