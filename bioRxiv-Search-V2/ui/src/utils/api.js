export async function login(email, password) {
  const response = await fetch("https://2025-01-ic4302.vercel.app/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Error en el login.");
  }
  return response.json(); // Espera recibir { token, user: { ... } }
}

// Por ejemplo también podemos actualizar la búsqueda para incluir el token:
export async function searchDocuments(query) {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://2025-01-ic4302.vercel.app/api/search?query=${encodeURIComponent(query)}`, {
    headers: {
      "Content-Type": "application/json",
      // Se añade el token en Authorization si está disponible
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error en la búsqueda.");
  }
  return response.json();
}