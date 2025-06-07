import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import SearchBar from "./SearchBar";
import ResultsList from "./ResultsList";

function SearchPage() {
  const { user } = useContext(UserContext);

  console.log("Usuario en contexto:", user);

  if (!user) {
    return <p>Acceso denegado. Por favor, inicia sesión.</p>;
  }

  return (
    <div>
      <h2>Bienvenido {user.displayName || user.email}</h2>
      <SearchBar />
      <ResultsList />
    </div>
  );
}

export default SearchPage;