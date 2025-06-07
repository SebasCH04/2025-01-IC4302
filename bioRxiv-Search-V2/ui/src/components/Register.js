import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/api";
import { UserContext } from "../UserContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(email, password, displayName);
      console.log("Respuesta del registro:", data);
      localStorage.setItem("token", data.token);
      const userObj = data.user || { uid: data.uid, email, displayName };
      setUser(userObj);
      navigate("/search");
    } catch (error) {
      console.error("Error en el registro:", error);
      setErrorMsg("Error al registrar el usuario.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
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
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;