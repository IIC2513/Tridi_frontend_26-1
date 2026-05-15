import client from "./client";

function toUser(u) {
  return {
    id:       u.id,
    username: u.username,
    image:    u.image ?? null,
    seller:   u.seller ?? false,
    role:     u.role ?? null,
  };
}

export async function login(username, password) {
  const { data } = await client.post("/auth/login", { username, password });
  return {
    token: data.session?.token ?? null,
    user:  data.user ? toUser(data.user) : null,
  };
}

export async function register(username, password) {
  const { data } = await client.post("/auth/register", { username, password });
  return {
    token: data.session?.token ?? null,
    user:  data.user ? toUser(data.user) : null,
  };
}

