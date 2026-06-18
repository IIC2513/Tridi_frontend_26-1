import { useState, useRef, useEffect } from "react";
import { FaTimes, FaCube } from "react-icons/fa";
import StatusMessage from "../StatusMessage/StatusMessage";
import { createModelWithFile } from "../../api/models";
import "./UploadModelModal.css";

const ALLOWED = [".glb", ".gltf"];
const MAX_BYTES = 50 * 1024 * 1024;

function hasAllowedExt(name) {
    return ALLOWED.some((ext) => name.toLowerCase().endsWith(ext));
}

export default function UploadModelModal({ open, onClose, onUploaded }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [tags, setTags] = useState("");
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);
    const inputRef = useRef(null);

    function reset() {
        setName("");
        setDescription("");
        setPrice("");
        setTags("");
        setFile(null);
        setSubmitting(false);
    }

    function close() {
        if (submitting) return;
        reset();
        onClose?.();
    }

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, submitting]);

    function pickFile(f) {
        if (!f) return;
        if (!hasAllowedExt(f.name)) {
            setStatus({ variant: "error", message: "Only .glb or .gltf files are allowed." });
            return;
        }
        if (f.size > MAX_BYTES) {
            setStatus({ variant: "error", message: "File exceeds the 50 MB limit." });
            return;
        }
        setFile(f);
    }

    function onDrop(e) {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files?.[0]);
    }

    async function handleSubmit() {
        if (!name.trim()) {
            setStatus({ variant: "warning", message: "Name is required." });
            return;
        }
        if (!file) {
            setStatus({ variant: "warning", message: "Please choose a model file." });
            return;
        }

        const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

        setSubmitting(true);
        try {
            const created = await createModelWithFile({
                file,
                name: name.trim(),
                description: description.trim() || null,
                price: Number(price) || 0,
                tags: tagList,
            });
            setStatus({ variant: "success", message: `"${created.name}" was uploaded.` });
            reset();
            onUploaded?.(created);
        } catch (err) {
            setStatus({ variant: "error", message: err.message || "Upload failed." });
        } finally {
            setSubmitting(false);
        }
    }

    if (!open) return null;

    return (
        <>
            <div className="uploadModal__overlay" onClick={close}>
                <div className="uploadModal" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className="uploadModal__close"
                        onClick={close}
                        aria-label="Close"
                    >
                        <FaTimes size={16} />
                    </button>

                    <h2 className="uploadModal__title">Upload Model</h2>
                    <hr className="uploadModal__rule" />

                    <label className="uploadModal__label">Name</label>
                    <input
                        className="uploadModal__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Low-poly truck"
                        maxLength={120}
                    />

                    <label className="uploadModal__label">Description</label>
                    <textarea
                        className="uploadModal__input uploadModal__textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional"
                        rows={3}
                    />

                    <div className="uploadModal__row">
                        <div className="uploadModal__col">
                            <label className="uploadModal__label">Price (USD)</label>
                            <input
                                className="uploadModal__input"
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className="uploadModal__col">
                            <label className="uploadModal__label">Tags</label>
                            <input
                                className="uploadModal__input"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="vehicle, lowpoly"
                            />
                        </div>
                    </div>

                    <label className="uploadModal__label">Model file</label>
                    <div
                        className={`uploadModal__drop ${dragging ? "uploadModal__drop--active" : ""} ${file ? "uploadModal__drop--filled" : ""}`}
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                    >
                        <FaCube size={22} className="uploadModal__dropIcon" />
                        {file ? (
                            <span className="uploadModal__dropText">{file.name}</span>
                        ) : (
                            <span className="uploadModal__dropText">
                                Drop a .glb / .gltf here, or click to browse
                            </span>
                        )}
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".glb,.gltf"
                            hidden
                            onChange={(e) => pickFile(e.target.files?.[0])}
                        />
                    </div>

                    <div className="uploadModal__actions">
                        <button
                            type="button"
                            className="uploadModal__btn uploadModal__btn--ghost"
                            onClick={close}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="uploadModal__btn uploadModal__btn--primary"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? "Uploading…" : "Upload"}
                        </button>
                    </div>
                </div>
            </div>

            {status && (
                <div className="uploadModal__toast">
                    <StatusMessage
                        variant={status.variant}
                        message={status.message}
                        onDismiss={() => setStatus(null)}
                    />
                </div>
            )}
        </>
    );
}