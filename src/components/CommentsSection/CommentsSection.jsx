import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
    getComments,
    createComment,
    updateComment,
    deleteComment,
} from "../../api/comments";
import "./CommentsSection.css";

function resolveImage(image) {
    if (!image) return null;
    if (/^https?:\/\//i.test(image)) return image;
    return `${import.meta.env.VITE_API_URL}${image}`;
}

function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function Avatar({ user }) {
    if (!user) {
        return <div className="cs-avatar">?</div>;
    }
    const image = resolveImage(user.image);
    if (image) {
        return (
            <div className="cs-avatar">
                <img src={image} alt={user.username || "user"} />
            </div>
        );
    }
    return (
        <div className="cs-avatar">
            {user.username?.charAt(0) ?? "?"}
        </div>
    );
}

function mergeCommentUser(comment, fallbackUser) {
    const user = comment.user ?? null;
    const shouldUseFallback =
        fallbackUser && (!user || (comment.userId != null && String(comment.userId) === String(fallbackUser.id)));

    if (!shouldUseFallback) {
        return comment;
    }

    return {
        ...comment,
        user: {
            id: user?.id ?? fallbackUser.id ?? null,
            username: user?.username ?? fallbackUser.username ?? null,
            image: user?.image ?? fallbackUser.image ?? null,
        },
        userId: comment.userId ?? user?.id ?? fallbackUser.id ?? null,
    };
}

function CommentItem({ comment, currentUserId, isAdmin, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [busy, setBusy] = useState(false);
    const profilePath = comment.user?.username ? `/users/${comment.user.username}` : null;

    const commentUserId = comment.userId ?? comment.user?.id;
    const isOwner = currentUserId != null && String(currentUserId) === String(commentUserId);
    const canDelete = isOwner || isAdmin;

    const handleSave = async () => {
        if (busy || !editContent.trim()) return;
        setBusy(true);
        try {
            const updated = await updateComment(comment.id, editContent.trim());
            onUpdate(updated);
            setEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (busy) return;
        if (!window.confirm("Delete this comment?")) return;
        setBusy(true);
        try {
            await deleteComment(comment.id);
            onDelete(comment.id);
        } catch (err) {
            console.error(err);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="cs-item">
            {profilePath ? (
                <Link className="cs-user-link" to={profilePath} aria-label={`View ${comment.user.username}'s profile`}>
                    <Avatar user={comment.user} />
                </Link>
            ) : (
                <Avatar user={comment.user} />
            )}
            <div className="cs-body">
                <div className="cs-header">
                    {profilePath ? (
                        <Link className="cs-user-link" to={profilePath}>
                            <span className="cs-username">
                                {comment.user?.username ?? "Unknown"}
                            </span>
                        </Link>
                    ) : (
                        <span className="cs-username">
                            {comment.user?.username ?? "Unknown"}
                        </span>
                    )}
                    <span className="cs-date">{formatDate(comment.createdAt)}</span>
                </div>

                {editing ? (
                    <>
                        <textarea
                            className="cs-content-editing"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="cs-actions">
                            <button
                                className="cs-btn"
                                onClick={() => {
                                    setEditing(false);
                                    setEditContent(comment.content);
                                }}
                                disabled={busy}
                            >
                                Cancel
                            </button>
                            <button
                                className="cs-btn"
                                onClick={handleSave}
                                disabled={busy || !editContent.trim()}
                            >
                                {busy ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="cs-content">{comment.content}</p>
                        <div className="cs-actions">
                            {isOwner && (
                                <button
                                    className="cs-btn"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    className="cs-btn cs-btn-danger"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function CommentsSection({ modelId }) {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newContent, setNewContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                const data = await getComments(modelId);
                if (cancelled) return;
                setComments(data);
                setError("");
            } catch {
                if (!cancelled) setError("Couldn't load comments.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [modelId, user]);

    const displayComments = useMemo(
        () => comments.map((comment) => mergeCommentUser(comment, user)),
        [comments, user]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting || !newContent.trim()) return;
        setSubmitting(true);
        try {
            const created = await createComment({
                content: newContent.trim(),
                modelId,
            });
            setComments((prev) => [...prev, created]);
            setNewContent("");
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = (updated) => {
        setComments((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
        );
    };

    const handleDelete = (id) => {
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="cs-section">
            <span className="cs-eyebrow">Comments ({comments.length})</span>

            {loading ? (
                <p className="cs-empty">Loading comments…</p>
            ) : error ? (
                <p className="cs-error">{error}</p>
            ) : comments.length === 0 ? (
                <p className="cs-empty">No comments yet.</p>
            ) : (
                <div className="cs-list">
                    {displayComments.map((c) => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            currentUserId={user?.id ?? null}
                            isAdmin={user?.role === "admin"}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {user ? (
                <form className="cs-form" onSubmit={handleSubmit}>
                    <textarea
                        className="cs-input"
                        placeholder="Share your thoughts about this model…"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="cs-submit"
                        disabled={submitting || !newContent.trim()}
                    >
                        {submitting ? "Posting…" : "Post comment"}
                    </button>
                </form>
            ) : (
                <p className="cs-login-hint">Log in to leave a comment.</p>
            )}
        </div>
    );
}
