import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { UserContext } from "../UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // Guarda el token y actualiza el estado del usuario globalmente
      localStorage.setItem("token", data.token);
      setUser(data.user); // Actualiza el estado global del usuario
      navigate("/search"); // Redirige a la página de búsqueda
    } catch (error) {
      console.error("Error en el login:", error);
      setErrorMsg("Credenciales inválidas o error en el login.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;