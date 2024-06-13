import React from 'react';
import { useNavigate } from 'react-router-dom';
import classes from '../../Données/Classes';
import '../../style/Profil.css';

const ListeClasses = () => {
  const navigate = useNavigate();

  const handleButtonClick = (id) => {
    navigate(`/classes/${id}`);
  };

  return (
    <div className="liste">
      <h2>Liste des classes</h2>
      <ul>
        {classes.map((classe, index) => (
          <li key={index}>
            <button className="Boutonadd" onClick={() => handleButtonClick(classe.id)}>
              {classe.nom}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeClasses;
