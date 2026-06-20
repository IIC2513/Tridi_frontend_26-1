import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./ModelInfo.css";
import ModelViewer from "../ModelViewer/ModelViewer";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { updateModel } from "../../api/models";

const formatSize = (bytes) => {
    if (bytes === null || bytes === undefined || isNaN(bytes)) return "—";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export default function ModelInfo({ handleCloseModal, product, onUpdated }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useContext(AuthContext);

    const [current, setCurrent] = useState(product);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(product.name ?? "");
    const [price, setPrice] = useState(String(product.price));
    const [description, setDescription] = useState(product.description ?? "");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.dispatchEvent(new CustomEvent("modelviewer:pause"));
        return () => {
            document.body.style.overflow = prev;
            window.dispatchEvent(new CustomEvent("modelviewer:resume"));
        };
    }, []);

    const canManage = !!user && (user.role === "admin" || user.id === current.creatorId);

    const handleAdd = async () => {
        handleCloseModal();
        await addToCart(current.id);
    };

    const openEdit = () => {
        setName(current.name ?? "");
        setPrice(String(current.price));
        setDescription(current.description ?? "");
        setEditing(true);
    };

    const handlePriceChange = (e) => {
        const v = e.target.value;
        if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setPrice(v);
    };

    const handleSave = async () => {
        if (busy) return;
        const n = Number(price);
        if (!name.trim() || price === "" || isNaN(n) || n < 0) return;
        setBusy(true);
        try {
            const updated = await updateModel(current.id, { name: name.trim(), price: n, description });
            const merged = {
                ...current,
                name: updated.name ?? name.trim(),
                price: updated.price ?? n,
                description: updated.description ?? description,
            };
            setCurrent(merged);
            setEditing(false);
            onUpdated?.(merged);
        } finally {
            setBusy(false);
        }
    };

    return createPortal(
        <>
            <div className="mi-overlay" onClick={handleCloseModal}>
                <div className="mi-shell" onClick={(e) => e.stopPropagation()}>
                    <div className="mi-viewer">
                        <ModelViewer src={current.modelUrl} alt={current.name} active />
                    </div>

                    <div className="mi-panel">
                        <div className="mi-head">
                            <h2 className="mi-title">{current.name}</h2>
                            {canManage && (
                                <button className="mi-edit" onClick={openEdit}>Edit</button>
                            )}
                        </div>

                        <div className="mi-body">
                            <section className="mi-section">
                                <span className="mi-eyebrow">Details</span>
                                <p className="mi-desc">
                                    {current.description?.trim()
                                        ? current.description
                                        : <span className="mi-faint">No description provided.</span>}
                                </p>
                                <span className="mi-meta">
                                    Published {new Date(current.createdAt).toLocaleDateString()}
                                </span>
                            </section>

                            <section className="mi-section">
                                <span className="mi-eyebrow">Creator</span>
                                <div className="mi-creator">
                                    <span className="mi-creator-name">{current.artist}</span>
                                    <button
                                        className="mi-link"
                                        onClick={() => navigate(`/users/${current.artist}`)}
                                    >
                                        View artist <span aria-hidden="true">→</span>
                                    </button>
                                </div>
                            </section>

                            <section className="mi-section">
                                <span className="mi-eyebrow">Tags</span>
                                {current.tags?.length ? (
                                    <div className="mi-tags">
                                        {current.tags.map((tag) => (
                                            <span key={tag} className="mi-tag">{tag}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="mi-faint">No tags</span>
                                )}
                            </section>

                            <section className="mi-section">
                                <span className="mi-eyebrow">Files</span>
                                <ul className="mi-files">
                                    {current.files?.map((file) => (
                                        <li key={file.id} className="mi-file">
                                            <span className="mi-file-ext">.{file.extension.toLowerCase()}</span>
                                            <span className="mi-file-dot">·</span>
                                            <span className="mi-file-size">{formatSize(file.size)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="mi-foot">
                            <div className="mi-price">
                                <span className="mi-price-cur">$</span>
                                <span className="mi-price-val">{current.price.toFixed(2)}</span>
                            </div>
                            <button className="mi-cta" onClick={handleAdd}>
                                Add to cart <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {editing && (
                <div className="mi-edit-overlay" onClick={() => !busy && setEditing(false)}>
                    <div className="mi-edit-card" onClick={(e) => e.stopPropagation()}>
                        <div className="mi-edit-head">Edit model</div>
                        <div className="mi-edit-body">
                            <div className="mi-edit-field">
                                <label className="mi-eyebrow">Title</label>
                                <input
                                    className="mi-edit-text"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Model title"
                                />
                            </div>
                            <div className="mi-edit-field">
                                <label className="mi-eyebrow">Price</label>
                                <div className="mi-edit-price">
                                    <span>$</span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={price}
                                        onChange={handlePriceChange}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="mi-edit-field">
                                <label className="mi-eyebrow">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your model…"
                                />
                            </div>
                        </div>
                        <div className="mi-edit-foot">
                            <button className="mi-btn-ghost" onClick={() => setEditing(false)} disabled={busy}>
                                Cancel
                            </button>
                            <button className="mi-btn-primary" onClick={handleSave} disabled={busy}>
                                {busy ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
}