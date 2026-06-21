import client from "./client";

function toRequest(r) {
    return {
        id: r.id,
        type: r.type,
        content: r.content ?? "",
        status: r.status,
        user: r.user
            ? { id: r.user.id, username: r.user.username, image: r.user.image ?? null }
            : null,
    };
}

export async function createRequest({ type, content }) {
    const { data } = await client.post("/requests", { type, content });
    return toRequest(data.data);
}

export async function getMyRequests() {
    const { data } = await client.get("/requests/my");
    return data.data.map(toRequest);
}

export async function getAllRequests() {
    const { data } = await client.get("/requests");
    return data.data.map(toRequest);
}

export async function getPendingRequests() {
    const { data } = await client.get("/requests/pending");
    return data.data.map(toRequest);
}

export async function updateRequestStatus(requestId, status) {
    const { data } = await client.patch(`/requests/${requestId}`, { status });
    return toRequest(data.data);
}