import client from "./client";

function toUser(u) {
  return {
    id: u.id,
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
  const { data } = await client.get(`/users/${username}`);
  return toUser(data.data);
}

export async function putUserChanges(id, payload) {
  const { data } = await client.put(`/users/${id}`, payload);
  return toUser(data.data);
}