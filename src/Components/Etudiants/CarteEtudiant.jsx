import React from 'react';
import { Link } from 'react-router-dom';

const CarteEtudiant = ({ etudiant, index, supprimerEtudiant, getClasseNom }) => {
  return (
    <div className="card">
      <Link to={`/etudiant/${index}`}>
        <p><strong>{etudiant.prenom} {etudiant.nom}</strong></p>
      </Link>
      <p>Âge : {etudiant.age} ans</p>
      <p>Classe : {getClasseNom(etudiant.classesId)}</p>
      <button onClick={() => supprimerEtudiant(index)}>Supprimer</button>
    </div>
  );
};

export default CarteEtudiant;
