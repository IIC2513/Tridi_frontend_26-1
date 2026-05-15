import client from "./client";

function toModel(model) {
  return {
    id:        model.id,
    name:      model.name,
    artist:    model.creator?.username ?? "Unknown",
    price:     Number(model.price),
    tags:      model.tags ?? [],
    image:     model.files?.find((f) => f.type?.startsWith("image"))?.url
               ?? model.files?.[0]?.url
               ?? null,
    createdAt: model.createdAt,
  };
}

export async function getModels() {
  const { data } = await client.get("/models");
  return data.data.map(toModel);
}

export async function getModelById(id) {
  const { data } = await client.get(`/models/${id}`);
  return toModel(data.data);
}

