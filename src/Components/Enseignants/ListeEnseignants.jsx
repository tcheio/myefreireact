import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import enseignants from '../../Données/Enseignant';

const ListeEnseignant = () => {
  const [selectedMatiere, setSelectedMatiere] = useState('');

  const handleMatiereChange = (event) => {
    setSelectedMatiere(event.target.value);
  };

  const filteredEnseignants = selectedMatiere
    ? enseignants.filter(enseignant => enseignant.matiere === selectedMatiere)
    : enseignants;

  const uniqueMatieres = [...new Set(enseignants.map(enseignant => enseignant.matiere))];

  return (
    <div className="TeachersList">
      <h2>Liste des enseignants</h2>
      <div>
        <label htmlFor="matiere-select">Filtrer par matière: </label>
        <select id="matiere-select" value={selectedMatiere} onChange={handleMatiereChange}>
          <option value="">Toutes les matières</option>
          {uniqueMatieres.map((matiere, index) => (
            <option key={index} value={matiere}>{matiere}</option>
          ))}
        </select>
      </div>
      <ul>
        {filteredEnseignants.map((enseignant, index) => (
          <li key={index}>
            <Link to={`/enseignants/${index}`}>{enseignant.prenom} {enseignant.nom}</Link>, {enseignant.age} ans, matière : {enseignant.matiere}
          </li>
        ))}
      </ul>
      <Link to="/add-enseignant">
        <button>Ajouter un enseignant</button>
      </Link>
    </div>
  );
};

export default ListeEnseignant;
