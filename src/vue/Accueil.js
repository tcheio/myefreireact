import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Accueil.css';

const Accueil = () => {
  return (
    <div className="Accueil">
      <h1>Bienvenue sur votre espace admin</h1>
      <div className="buttons-container">
        <Link to="/etudiant">
          <button className="btn">Gérer la liste des Etudiants</button>
        </Link>
        <Link to="/enseignant">
          <button className="btn">Gérer la liste des Enseignants</button>
        </Link>
        <Link to="/classes">
          <button className="btn">Gérer toutes les classes</button>
        </Link>
        <Link to="/actualite">
          <button className="btn">Gérer toutes les actualitées</button>
        </Link>
      </div>
    </div>
  );
};

export default Accueil;
