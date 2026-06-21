import client from "./client";

export async function getComments(modelId) {
    const { data } = await client.get(`/models/${modelId}/comments`);
    return (data.data ?? data).map(toComment);
}

export async function createComment({ content, modelId }) {
    const { data } = await client.post("/comments", { content, modelId });
    return toComment(data.data ?? data);
}

export async function updateComment(id, content) {
    const { data } = await client.patch(`/comments/${id}`, { content });
    return toComment(data.data ?? data);
}

export async function deleteComment(id) {
    await client.delete(`/comments/${id}`);
}

function resolveUrl(route) {
    if (!route) return null;
    return /^https?:\/\//i.test(route) ? route : `${import.meta.env.VITE_API_URL}${route}`;
}

function toUser(u) {
    if (!u) return null;
    return {
        id: u.id ?? u._id ?? null,
        username: u.username ?? u.userName ?? u.name ?? u.displayName ?? null,
        image: resolveUrl(u.image ?? u.avatar ?? u.avatarUrl ?? u.photo ?? u.photoUrl ?? null),
    };
}

function toComment(c) {
    if (!c) return c;
    const user = toUser(
        c.user ??
            c.author ??
            c.creator ??
            (c.username || c.image || c.avatar || c.photo || c.photoUrl
                ? {
                      id: c.userId ?? c.authorId ?? c.creatorId ?? null,
                      username: c.username ?? c.userName ?? c.name ?? c.authorName ?? c.creatorName ?? null,
                      image: c.image ?? c.avatar ?? c.avatarUrl ?? c.photo ?? c.photoUrl ?? null,
                  }
                : null)
    );

    return {
        id: c.id,
        content: c.content,
        modelId: c.modelId,
        userId: c.userId ?? c.authorId ?? c.creatorId ?? user?.id ?? null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        user,
    };
}
