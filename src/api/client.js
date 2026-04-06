const API = process.env.REACT_APP_API_URL;

async function parseJson(res) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await parseJson(res);

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
