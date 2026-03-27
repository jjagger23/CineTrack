const API = process.env.REACT_APP_API_URL;

export async function login(username, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  return res.json(); // { token, user }
}

export async function register(username, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || "Register failed");
  return res.json(); // { token, user }
}
