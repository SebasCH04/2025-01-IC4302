import React from "react";

function ResultsList({ results = [] }) {
  if (results.length === 0) {
    return <p>No se encontraron resultados.</p>;
  }
  return (
    <ul>
      {results.map((item, index) => (
        <li key={index}>
          <h3>{item.title}</h3>
          <p>{item.abstract}</p>
        </li>
      ))}
    </ul>
  );
}

export default ResultsList;