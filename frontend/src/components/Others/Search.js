import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./styles.css";

const Search = ({ history, query }) => {
  const [searchQuery, setSeachQuery] = useState(query || "");

  useEffect(() => {
    history.push(`/${searchQuery}`);
  }, [searchQuery, history]);  // ✅ Ajout de 'history' dans les dépendances

  return (
    <div className="container-search mb-4">
      <Form.Label>Bienvenue sur notre Pokédex !</Form.Label>
      <div className="container-input-btn">
        <input
          onChange={(e) => setSeachQuery(e.currentTarget.value)}
          value={searchQuery}
          placeholder="Recherchez un Pokémon"
        />
        {searchQuery !== "" && (   // ✅ Utilisation de !== pour éviter le warning eqeqeq
          <button onClick={() => setSeachQuery("")} className="btn-clear">
            <FontAwesomeIcon icon={faTimes} color={"white"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
