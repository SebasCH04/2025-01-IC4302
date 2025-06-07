import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SearchPage from "./components/SearchPage";
import Header from "./components/Header";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/search" element={<SearchPage user={user} />} />
      </Routes>
    </div>
  );
}

export default App;