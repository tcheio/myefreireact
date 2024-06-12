import React from 'react';
import { Link } from 'react-router-dom';

const Accueil = () => {
  return (
    <div className="Home">
      <h1>Bienvenue sur notre plateforme</h1>
      <div>
        <Link to="/students">
          <button>Afficher la liste des élèves</button>
        </Link>
        <Link to="/teachers">
          <button>Afficher la liste des enseignants</button>
        </Link>
        <Link to="/classes">
          <button>Afficher toutes les classes</button>
        </Link>
      </div>
    </div>
  );
};

export default Accueil;
