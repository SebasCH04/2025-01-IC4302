import React, { useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  
  return (
    <div className="App">
      <Header />
      { !user ? (
        <Login setUser={setUser} />
      ) : (
        <>
          <SearchBar setResults={setResults} />
          <ResultsList results={results} />
        </>
      )}
    </div>
  );
}

export default App;