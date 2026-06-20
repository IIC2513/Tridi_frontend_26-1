import { useState } from "react";
import Button from "../Button/Button";
import { createRequest } from "../../api/requests";
import "./RequestSellerModal.css";

export default function RequestSellerModal({ open, onClose, onSubmitted }) {
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!open) return null;

    async function handleSubmit() {
        setError(null);
        setSubmitting(true);
        try {
            const created = await createRequest({ type: "seller", content: comment.trim() });
            setComment("");
            onSubmitted?.(created);
        } catch (e) {
            setError(e?.response?.data?.error || e.message || "Could not send request.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="reqModalOverlay" onClick={onClose}>
            <div className="reqModal" onClick={(e) => e.stopPropagation()}>
                <h2 className="reqModalTitle">Request to become a Seller</h2>
                <p className="reqModalText">
                    Tell us why you'd like to sell on Tridi. An admin will review your request.
                </p>
                <textarea
                    className="reqModalTextarea"
                    placeholder="Write a short message for the admins..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                />
                {error && <p className="reqModalError">{error}</p>}
                <div className="reqModalActions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={submitting}
                        bgColor="#2a2a2a"
                        hoverBgColor="#3a3a3a"
                        textColor="#e7e7e7"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || comment.trim().length === 0}
                        bgColor="#cf7e4f"
                        hoverBgColor="#b86a3e"
                        textColor="#101010"
                    >
                        {submitting ? "Sending..." : "Send Request"}
                    </Button>
                </div>
            </div>
        </div>
    );
}