import React from 'react';
import { Link } from 'react-router-dom';
import enseignants from '../../Données/Enseignant';

const ListeEnseignant = () => {
  return (
    <div className="TeachersList">
      <h2>Liste des enseignants</h2>
      <ul>
        {enseignants.map((enseignant, index) => (
          <li key={index}>
            <Link to={`/enseignants/${index}`}>
              {enseignant.prenom} {enseignant.nom}, {enseignant.age} ans, matière : {enseignant.matiere}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeEnseignant;
