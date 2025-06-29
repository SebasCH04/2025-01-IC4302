import React, { useState } from "react";
import { searchDocuments } from "../utils/api";

function SearchBar({ setResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const data = await searchDocuments(query);
      setResults(data.results);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar artículos sobre COVID-19..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "300px" }} // Ajusta el ancho aquí
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}

export default SearchBar;