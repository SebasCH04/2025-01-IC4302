import React from "react";

function ResultsList({ results }) {
  return (
    <div>
      <h2>Resultados</h2>
      {results.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        <ul>
          {results.map((item) => (
            <li key={item._id}>
              <h3>{item.title}</h3>
              <p>{item.abstract}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResultsList;