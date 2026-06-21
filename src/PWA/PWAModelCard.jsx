import { useState, useEffect } from "react";
import ModelViewer from "../components/ModelViewer/ModelViewer";
import ModelInfo from "../components/ModelInfo/ModelInfo";
import { storeModel, isModelSaved, deleteModel, getModelEntry } from "./indexedDB";
import client from "../api/client";
import "./PWAModelCard.css";

export default function PWAModelCard({ product, online = true, isCreator = false }) {
  const [current, setCurrent] = useState(product);
  const { id, name, artist, modelUrl, image } = current;
  const [status, setStatus] = useState("idle");
  const [offlineBlobUrl, setOfflineBlobUrl] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const glbFile = current.files?.find((f) => f.extension === "glb");

  const inPwa = window.location.pathname.startsWith("/pwa");
  const showEdit = isCreator && online && !inPwa;

  useEffect(() => {
    isModelSaved(id).then((saved) => {
      if (saved) setStatus("saved");
    });
  }, [id]);

  useEffect(() => {
    if (online) {
      setOfflineBlobUrl(null);
      return;
    }
    getModelEntry(id).then((entry) => {
      if (entry?.blob) {
        const url = URL.createObjectURL(entry.blob);
        setOfflineBlobUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    });
  }, [online, id]);

  useEffect(() => {
    if (!showEdit) setInfoOpen(false);
  }, [showEdit]);

  useEffect(() => {
    return () => {
      if (offlineBlobUrl) URL.revokeObjectURL(offlineBlobUrl);
    };
  }, [offlineBlobUrl]);

  const handleDownload = async () => {
    if (!glbFile) return;
    setStatus("downloading");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const url = glbFile.route.startsWith("http")
        ? glbFile.route
        : `${apiUrl}${glbFile.route}`;
      const { data: blob } = await client.get(url, { responseType: "blob" });

      await storeModel(id, blob, current);

      setStatus("saved");

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = glbFile.originalName || `${name}.glb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      setStatus("idle");
    }
  };

  const handleDelete = async () => {
    await deleteModel(id);
    setStatus("idle");
  };

  const handleExport = async () => {
    const entry = await getModelEntry(id);
    if (!entry?.blob) return;
    const blobUrl = URL.createObjectURL(entry.blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = glbFile?.originalName || `${name}.glb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const buttonLabel =
    status === "downloading" ? "Downloading…" :
    status === "saved"       ? "Saved ✓" :
    "Download";

  return (
    <article className="pwaModelCard">
      <div className="productImageWrap">
        {modelUrl || offlineBlobUrl ? (
          <ModelViewer src={offlineBlobUrl || modelUrl} />
        ) : (
          <img src={image} alt={name} className="productImage" />
        )}
      </div>
      <div className="productData">
        <div className="productInfo">
          <h3 className="productName">{name}</h3>
          <p className="productArtist">{artist}</p>
        </div>
      </div>
      <div className="pwaModelCardActions">
        {showEdit && (
          <button className="pwaEditBtn" onClick={() => setInfoOpen(true)} title="Edit this model">
            Edit
          </button>
        )}
        {glbFile ? (
          <>
            <button
              className={`pwaDlBtn ${status === "saved" ? "saved" : ""}`}
              onClick={handleDownload}
              disabled={status === "downloading"}
            >
              {buttonLabel}
            </button>
            {status === "saved" && (
              <button className="pwaExportBtn" onClick={handleExport} title="Export to computer">
                Export
              </button>
            )}
            {status === "saved" && (
              <button className="pwaDeleteBtn" onClick={handleDelete} title="Remove from local storage">
                ✕
              </button>
            )}
          </>
        ) : (
          <span className="pwaNoGlb">No .glb available</span>
        )}
      </div>

      {infoOpen && showEdit && (
        <ModelInfo
          product={current}
          handleCloseModal={() => setInfoOpen(false)}
          onUpdated={(updated) => setCurrent(updated)}
        />
      )}
    </article>
  );
}