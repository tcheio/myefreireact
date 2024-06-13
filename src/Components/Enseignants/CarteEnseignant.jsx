import React from 'react';
import { Link } from 'react-router-dom';

const CarteEnseignant = ({ enseignant, index, supprimerEnseignant }) => {
  return (
    <div className="card">
      <Link to={`/enseignants/${index}`}>
        <p><strong>{enseignant.prenom} {enseignant.nom}</strong></p>
      </Link>
      <p>Âge : {enseignant.age} ans</p>
      <p>Matière : {enseignant.matiere}</p>
      <button onClick={() => supprimerEnseignant(index)}>Supprimer</button>
    </div>
  );
};

export default CarteEnseignant;
