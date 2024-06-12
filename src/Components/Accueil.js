import React from 'react';
import { Link } from 'react-router-dom';

const Accueil = () => {
  return (
    <div className="Home">
      <h1>Bienvenue sur notre plateforme</h1>
      <div>
        <Link to="/etudiant">
          <button>Afficher la liste des Etudiants</button>
        </Link>
        <Link to="/enseignant">
          <button>Afficher la liste des Enseignants</button>
        </Link>
        <Link to="/classes">
          <button>Afficher toutes les classes</button>
        </Link>
        <Link to="/actualite">
          <button>Afficher toutes les actualitées</button>
        </Link>
      </div>
    </div>
  );
};

export default Accueil;
