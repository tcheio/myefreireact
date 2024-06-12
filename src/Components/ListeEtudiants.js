import React from 'react';
import eleves from '../Données/Eleves';

const ListeEtudiants = () => {
  return (
    <div className="listeEtudiant">
      <h2>Liste des élèves</h2>
      <ul>
        {eleves.map((eleves, index) => (
          <li key={index}>
            {eleves.prenom} {eleves.nom}, {eleves.age} ans, classe : {eleves.classe}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeEtudiants;
