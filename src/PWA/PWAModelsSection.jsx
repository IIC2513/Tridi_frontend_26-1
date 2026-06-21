import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useAuth } from "../context/useAuth";
import { getCreatedModels, getPurchasedItems } from "../api/models";
import { getAllSavedProducts } from "./indexedDB";
import PWAModelCard from "./PWAModelCard";
import "./PWAHome.css";

export default function PWAModelsSection({ search = "", showHeader = true, autoSync = false, userId = null }) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [models, setModels] = useState([]);
  const [createdIds, setCreatedIds] = useState(new Set());
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [initialized, setInitialized] = useState(false);
  const didAutoSync = useRef(false);

  const isExternalUser = userId !== null;

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const fetchExternalUserModels = useCallback(async () => {
    if (!userId || !navigator.onLine) return;
    setSyncing(true);
    try {
      const created = await getCreatedModels(userId);
      const cIds = new Set(created.map((m) => m.id));
      setCreatedIds(cIds);
      setModels(created);
    } catch (err) {
      console.error("PWA: Failed to fetch external user models", err);
    } finally {
      setSyncing(false);
      setInitialized(true);
    }
  }, [userId]);

  const syncFromAPI = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !navigator.onLine) return;
    setSyncing(true);
    try {
      const [created, purchased] = await Promise.all([
        getCreatedModels(user.id),
        getPurchasedItems(user.id),
      ]);
      const map = new Map();
      const cIds = new Set();
      for (const m of created) {
        cIds.add(m.id);
        map.set(m.id, m);
      }
      for (const m of purchased) {
        if (!map.has(m.id)) map.set(m.id, m);
      }
      setCreatedIds(cIds);
      setModels(Array.from(map.values()));
    } catch (err) {
      console.error("PWA: Failed to fetch user models", err);
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isExternalUser) {
      setModels([]);
      setCreatedIds(new Set());
      setInitialized(false);
      didAutoSync.current = false;
      fetchExternalUserModels();
      return;
    }
    if (!isAuthenticated) {
      setModels([]);
      setCreatedIds(new Set());
      setInitialized(false);
      didAutoSync.current = false;
      return;
    }
    getAllSavedProducts().then((saved) => {
      setModels(saved);
      setInitialized(true);
      if (autoSync && navigator.onLine) {
        syncFromAPI();
      } else if (saved.length === 0 && navigator.onLine && !didAutoSync.current) {
        didAutoSync.current = true;
        syncFromAPI();
      }
    });
  }, [isAuthenticated, syncFromAPI, autoSync, isExternalUser, fetchExternalUserModels]);

  const query = search.trim().toLowerCase();
  const filteredModels = useMemo(() => {
    if (!query) return models;
    return models.filter((m) =>
      (m.name || "").toLowerCase().includes(query)
    );
  }, [models, query]);

  const hasModels = models.length > 0;
  const hasFiltered = filteredModels.length > 0;

  if (authLoading && !isExternalUser) {
    return <p className="pwa-loading">Loading…</p>;
  }

  if (!isExternalUser && !initialized) {
    return <p className="pwa-loading">Loading…</p>;
  }

  if (!isExternalUser && !isAuthenticated) return null;

  return (
    <section className="pwa-section">
      {!isExternalUser && !online && (
        <div className="pwa-offline-banner">
          <span className="pwa-offline-icon">⚡</span>
          <p className="pwa-offline-text">You are offline. Showing saved models.</p>
        </div>
      )}

      {showHeader && !isExternalUser && (
        <div className="pwa-header">
          <h1 className="pwa-title">Your Models</h1>
          {online && !autoSync && (
            <button className="pwa-syncBtn" onClick={syncFromAPI} disabled={syncing}>
              {syncing ? "Syncing…" : "Sync from internet"}
            </button>
          )}
        </div>
      )}

      {!showHeader && !isExternalUser && online && !autoSync && (
        <div className="pwa-syncBar">
          <button className="pwa-syncBtn" onClick={syncFromAPI} disabled={syncing}>
            {syncing ? "Syncing…" : "Sync models"}
          </button>
        </div>
      )}

      {syncing && !hasFiltered && !isExternalUser && (
        <p className="pwa-loading">Loading your models…</p>
      )}

      {syncing && !hasFiltered && isExternalUser && (
        <p className="pwa-loading">Loading models…</p>
      )}

      {!syncing && !hasFiltered && online && !isExternalUser && (
        <p className="pwa-empty">
          {hasModels ? "No models match your search." : "No models yet."}
        </p>
      )}

      {!syncing && !hasFiltered && online && isExternalUser && (
        <p className="pwa-empty">This artist has no models yet.</p>
      )}

      {!syncing && !hasFiltered && !online && !isExternalUser && (
        <p className="pwa-empty">
          {hasModels ? "No saved models match your search." : "No models saved offline."}
        </p>
      )}

      {hasFiltered && (
        <div className="pwa-models-grid">
          {filteredModels.map((m) => (
            <PWAModelCard key={m.id} product={m} online={online} isCreator={isExternalUser ? false : createdIds.has(m.id)} />
          ))}
        </div>
      )}
    </section>
  );
}
