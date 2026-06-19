const DB_NAME = "tridi-pwa";
const DB_VERSION = 1;
const STORE_NAME = "models";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Store a model blob + full product metadata in IndexedDB.
 * @param {string} id
 * @param {Blob} blob
 * @param {object} product — full model object { id, name, artist, price, modelUrl, files, ... }
 */
export async function storeModel(id, blob, product = {}) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, blob, product, savedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Retrieve a model entry from IndexedDB */
export async function getModelEntry(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

/** Retrieve only the blob */
export async function getModelBlob(id) {
  const entry = await getModelEntry(id);
  return entry?.blob ?? null;
}

/** Check if a model is already saved locally */
export async function isModelSaved(id) {
  const entry = await getModelEntry(id);
  return !!entry;
}

/** Delete a model from IndexedDB */
export async function deleteModel(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all saved models from IndexedDB, returning usable product
 * objects so they can be rendered as cards offline.
 * Handles both old format ({ metadata }) and new format ({ product }).
 */
export async function getAllSavedProducts() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const entries = req.result ?? [];
      const products = entries
        .map((e) => {
          const prod = e.product || e.metadata || {};
          return { ...prod, id: e.id };
        })
        .filter((p) => p.id);
      resolve(products);
    };
    req.onerror = () => reject(req.error);
  });
}

