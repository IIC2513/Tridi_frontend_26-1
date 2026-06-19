const DB_NAME = "tridi-models";
const STORE = "blobs";
let dbProm = null;

function makePromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function openDB() {
  if (dbProm) return dbProm;
  const req = indexedDB.open(DB_NAME, 1);
  req.onupgradeneeded = () => req.result.createObjectStore(STORE);
  dbProm = makePromise(req);
  return dbProm;
}

async function readBlob(key) {
  try {
    const db = await openDB();
    const store = db.transaction(STORE).objectStore(STORE);
    return (await makePromise(store.get(key))) ?? null;
  } catch {
    return null;
  }
}

async function writeBlob(key, blob) {
  try {
    const db = await openDB();
    const store = db.transaction(STORE, "readwrite").objectStore(STORE);
    await makePromise(store.put(blob, key));
  } catch (e) {
    console.warn("failed to write to cache :(", e);
  }
}

export async function getModelBlob(src, key = src, { signal } = {}) {
  const cached = await readBlob(key);
  if (cached) return cached;

  const res = await fetch(src, { signal });
  if (!res.ok) throw new Error(`Failed to fetch model: ${res.status}`);
  const blob = await res.blob();
  writeBlob(key, blob); 
  return blob;
}