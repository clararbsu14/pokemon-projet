import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import "./styles.css";

const Footer = () => {
  return (
    <footer className="mt-5">
      <div className="d-flex justify-content-center align-items-center">
        <p className="mr-1 credits-text">Projet réalisé par Clara Rabusseau, Pierre Mazure, Brieuc Huot</p>
      </div>
      <div className="view-code">
        JUNIA ISEN 2025 AP4
        <FontAwesomeIcon className="ml-2" icon={faGithub} />
      </div>
    </footer>
  );
};

export default Footer;
