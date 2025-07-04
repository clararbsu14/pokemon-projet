import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./styles.css";
import { GetImageById } from "../../functions/utils";
import pokemon_placeholder from "../../assets/img/pokemon-placeholder.png";

const PokeCard = ({ name, id, types, click = true }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [id]);

  const safeTypes = Array.isArray(types) ? types : [];

  return (
    <div className="container-card mb-4">
      <div className="text-center">
        <h2 className="pokemon-name limit-text my-0">{name}</h2>
        <p className="pokemon-number mb-0">
          # {id.toString().padStart(3, "0")}
        </p>
      </div>
      <figure
        className={`container-card-img position-relative my-4 ${safeTypes[0]?.name ? `container-${safeTypes[0].name}` : ""
          }`}
      >
        <Link to={click ? `/details/${id}` : "#"}>
          <img
            onError={() => setError(true)}
            className="animation-up-down"
            alt={name}
            title={name}
            src={error ? pokemon_placeholder : GetImageById(id)}
          />
        </Link>
      </figure>
      <div className="w-100 d-flex justify-content-between">
        {safeTypes.map((item, index) => (
          <div
            key={index}
            className={`type-item ${item.name} ${safeTypes.length === 1 ? "w-100" : ""}`}
          >
            <p className="mb-0 text-uppercase">
              {item.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokeCard;
