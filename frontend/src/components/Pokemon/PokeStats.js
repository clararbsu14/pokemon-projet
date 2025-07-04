import React from "react";

const PokeStats = ({ stats }) => {
  if (!stats) {
    return <p>Loading stats...</p>;
  }

  return (
    <div className="container-bar mt-0">
      <h4 className="w-100 mb-4 section-title">Stats</h4>
      <div className="bar-item">
        <p><strong>HP:</strong> {stats.hp}</p>
        <p><strong>Attack:</strong> {stats.attack}</p>
        <p><strong>Defense:</strong> {stats.defense}</p>
        <p><strong>Sp. Attack:</strong> {stats.sp_attack}</p>
        <p><strong>Sp. Defense:</strong> {stats.sp_defense}</p>
        <p><strong>Speed:</strong> {stats.speed}</p>
      </div>
    </div>
  );
};

export default PokeStats;
