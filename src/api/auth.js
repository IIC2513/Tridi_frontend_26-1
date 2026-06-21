import client from "./client";

function toUser(u) {
  return {
    id:       u.id ?? u._id ?? null,
    email:    u.email,
    username: u.username,
    image:    u.image ?? null,
    seller:   u.seller ?? false,
    role:     u.role ?? null,
  };
}

export async function login(email, password) {
  const { data } = await client.post("/login", { email, password });
  return {
    token: data.session?.token ?? null,
    user:  data.user ? toUser(data.user) : null,
  };
}

export async function register({ email, username, password, image }) {
  let payload = { email, username, password };
  let config = {};

  if (image instanceof File) {
    const fd = new FormData();
    fd.append("email", email);
    fd.append("username", username);
    fd.append("password", password);
    fd.append("image", image);
    payload = fd;
    config = { headers: { "Content-Type": "multipart/form-data" } };
  }

  const { data } = await client.post("/signup", payload, config);
  return {
    token: data.session?.token ?? null,
    user:  data.user ? toUser(data.user) : null,
  };
}

export async function loginWithProvider(serviceName) {
  const { data } = await client.post("/signup", { serviceName });
  if (!data?.url) throw new Error("Provider URL missing in response.");
  window.location.href = data.url;
}

export async function completeProviderLogin(providerToken) {
  const { data } = await client.post("/signup", { providerToken });
  return {
    token: data.session?.token ?? null,
    user:  data.user ? toUser(data.user) : null,
  };
}