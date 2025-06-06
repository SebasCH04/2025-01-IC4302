import React, { useState } from "react";
import { searchDocuments } from "../utils/api";

function SearchBar({ setResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchDocuments(query);
      setResults(data.results);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;