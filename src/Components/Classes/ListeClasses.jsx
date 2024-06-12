import React from 'react';
import { Link } from 'react-router-dom';
import classes from '../../Données/Classes';

const ListeClasses = () => {
  return (
    <div className="ClassesList">
      <h2>Liste des classes</h2>
      <ul>
        {classes.map((classe, index) => (
          <li key={index}>
            <Link to={`/classes/${classe.id}`}>
              {classe.nom}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeClasses;
