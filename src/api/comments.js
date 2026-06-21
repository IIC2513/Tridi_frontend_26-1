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

function toComment(c) {
    if (!c) return c;
    return {
        id: c.id,
        content: c.content,
        modelId: c.modelId,
        userId: c.userId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        user: c.user
            ? {
                  id: c.user.id,
                  username: c.user.username,
                  image: c.user.image,
              }
            : null,
    };
}
