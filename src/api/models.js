import client from "./client";

function toModel(model) {
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
  return data.data.map(toModel);
}

export async function getModelById(id) {
  const { data } = await client.get(`/models/${id}`);
  return toModel(data.data);
}

