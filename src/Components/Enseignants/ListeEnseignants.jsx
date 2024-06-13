import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import enseignantsData from '../../Données/Enseignant';

const ListeEnseignant = () => {
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [enseignants, setEnseignants] = useState(enseignantsData);

  const handleMatiereChange = (event) => {
    setSelectedMatiere(event.target.value);
  };

  const filteredEnseignants = selectedMatiere
    ? enseignants.filter(enseignant => enseignant.matiere === selectedMatiere)
    : enseignants;

  const uniqueMatieres = [...new Set(enseignants.map(enseignant => enseignant.matiere))];

  const supprimerEnseignant = (index) => {
    const nouvelleListeEnseignants = [...enseignants];
    nouvelleListeEnseignants.splice(index, 1);
    setEnseignants(nouvelleListeEnseignants);
  };

  return (
    <div className="liste">
      <h2>Liste des enseignants</h2>
      <Link to="/enseignants/ajouter">
        <button className="Boutonadd">Ajouter un enseignant</button>
      </Link>

      <label htmlFor="matiere-select">Filtrer par matière: </label>
      <select id="matiere-select" value={selectedMatiere} onChange={handleMatiereChange}>
        <option value="">Enseignants</option>
        {uniqueMatieres.map((matiere, index) => (
          <option key={index} value={matiere}>{matiere}</option>
        ))}
      </select>
      <div className="grid">
      {filteredEnseignants.map((enseignant, index) => (
        <div key={index} className="card">
          <Link to={`/enseignants/${index}`}><p><strong>{enseignant.prenom} {enseignant.nom}</strong></p></Link>
          <p>Âge : {enseignant.age} ans</p>
          <p>Matière : {enseignant.matiere}</p>
          <button onClick={() => supprimerEnseignant(index)}>Supprimer</button>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ListeEnseignant;
