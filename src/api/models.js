import client from "./client";

function resolveUrl(route) {
    if (!route) return null;
    return /^https?:\/\//i.test(route) ? route : `${import.meta.env.VITE_API_URL}${route}`;
}

export function toModel(model) {
    const glbFile = model.files?.find((file) => file.extension === "glb");
    return {
        id: model.id,
        name: model.name,
        artist: model.creator?.username ?? "Unknown",
        creatorId: model.creatorId ?? model.creator?.id ?? null,
        price: Number(model.price),
        tags: model.tags ?? [],
        description: model.description,
        files: model.files,
        modelUrl: glbFile ? resolveUrl(glbFile.route) : null,
        createdAt: model.createdAt,
    };
}

export async function getModels() {
    const { data } = await client.get("/models");
    return (data.data ?? data).map(toModel);
}

export async function getModelById(id) {
    const { data } = await client.get(`/models/${id}`);
    return toModel(data.data ?? data);
}

export async function getCreatedModels(ownerId) {
    const { data } = await client.get(`/models/created/${ownerId}`);
    return (data.data ?? data).map(toModel);
}

export async function getPurchasedItems(buyerId) {
    const { data } = await client.get(`/purchases/items/by/${buyerId}`);
    return (data.data ?? data).map(toModel);
}

export async function createModel({ name, description, price, tags = [] }) {
    const { data } = await client.post("/models", { name, description, price, tags });
    return data.data;
}

export async function updateModel(id, { name, price, description }) {
    const { data } = await client.patch(`/models/${id}`, { name, price, description });
    return toModel(data.data ?? data);
}

export async function uploadModelFile({ modelId, file }) {
    const { data } = await client.put(
        `/models/${modelId}/file?filename=${encodeURIComponent(file.name)}`,
        file,
        { headers: { "Content-Type": file.type || "application/octet-stream" } }
    );
    return toModel(data.data);
}

export async function createModelWithFile({ file, ...meta }) {
    const model = await createModel(meta);
    return uploadModelFile({ modelId: model.id, file });
}