import React from 'react';
import enseignants from '../Données/Enseignant';

const ListeEnseignant = () => {
  return (
    <div className="TeachersList">
      <h2>Liste des enseignants</h2>
      <ul>
        {enseignants.map((enseignants, index) => (
          <li key={index}>
            {enseignants.prenom} {enseignants.nom}, {enseignants.age} ans, matière : {enseignants.matiere}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeEnseignant;
