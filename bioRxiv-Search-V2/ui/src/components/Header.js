import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina el token y limpia el contexto del usuario
    localStorage.removeItem("token");
    setUser(null);
    // Navega al login
    navigate("/");
  };

  return (
    <header style={{ backgroundColor: "#4a90e2", color: "white", padding: "1rem", textAlign: "center" }}>
      <h1>BioRxiv Search: COVID-19</h1>
      {user && (
        <button onClick={handleLogout}>Cerrar sesión</button>
      )}
    </header>
  );
}

export default Header;