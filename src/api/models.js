import client from "./client";

export function toModel(model) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const glbFile = model.files?.find(
    (file) => file.extension === "glb"
  );

  return {
    id: model.id,
    name: model.name,
    artist: model.creator?.username ?? "Unknown",
    price: Number(model.price),
    tags: model.tags ?? [],
    description: model.description,
    files: model.files,

    modelUrl: glbFile
      ? `${apiUrl}${glbFile.route}`
      : null,

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

/** Models created by this user */
export async function getCreatedModels(ownerId) {
  const { data } = await client.get(`/models/created/${ownerId}`);
  return (data.data ?? data).map(toModel);
}

/** Models the user owns through purchases */
export async function getPurchasedItems(buyerId) {
  const { data } = await client.get(`/purchases/items/by/${buyerId}`);
  return (data.data ?? data).map(toModel);
}

