export async function searchDocuments(query) {
  const response = await fetch(`https://2025-01-ic4302.vercel.app/api/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Error en la búsqueda");
  }
  return response.json();
}