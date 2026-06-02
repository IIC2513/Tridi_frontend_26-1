import client from "./client";

function toUser(u) {
  return {
    email:    u.email,
    username: u.username,
    image:    u.image ?? null,
    seller:   u.seller ?? false,
    role:     u.role ?? null,
    reputation: u.stats?.reputation ?? 0,
    c_purchases: u.stats?.c_purchases ?? 0,
    c_sales: u.stats?.c_sales ?? 0,
  };
}

export async function getUsers() {
  const { data } = await client.get("/users");
  return data.data.map(toUser);
}

export async function getUserByName(username) {
  const { data } = await client.get(`/models/${username}`);
  return toModel(data.data);
}