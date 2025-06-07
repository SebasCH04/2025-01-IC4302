import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import SearchBar from "./SearchBar";
import ResultsList from "./ResultsList";

function SearchPage() {
  const { user } = useContext(UserContext);
  const [results, setResults] = useState([]); // inicializamos como arreglo vacío

  if (!user) {
    return <p>Acceso denegado. Por favor, inicia sesión.</p>;
  }

  return (
    <div>
      <h2>Bienvenido {user.displayName || user.email}</h2>
      <SearchBar setResults={setResults} />
      <ResultsList results={results} />  {/* Siempre le pasamos un arreglo */}
    </div>
  );
}

export default SearchPage;