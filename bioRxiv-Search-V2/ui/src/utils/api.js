export async function login(email, password) {
  const response = await fetch("https://2025-01-ic4302.vercel.app/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Error en el login.");
  }
  return response.json();
}

export async function searchDocuments(query) {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://2025-01-ic4302.vercel.app/api/search?query=${encodeURIComponent(query)}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, //incluye el token si es necesario
    },
  });
  if (!response.ok) {
    throw new Error("Error en la búsqueda.");
  }
  return response.json();
}

export async function register(email, password, displayName) {
  const response = await fetch("https://2025-01-ic4302.vercel.app/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });
  if (!response.ok) {
    throw new Error("Error en el registro.");
  }
  return response.json();
}