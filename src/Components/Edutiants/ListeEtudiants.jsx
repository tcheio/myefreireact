import React, { useState } from 'react';
import eleves from '../../Données/Eleves';
import './ListeEtudiants.css';

const ListeEtudiants = () => {
  const [classeSelectionnee, setClasseSelectionnee] = useState('Toutes');

  const classes = ['Toutes', ...new Set(eleves.map(eleve => eleve.classe))];

  const handleChange = (event) => {
    setClasseSelectionnee(event.target.value);
  };

  const etudiantsFiltres = classeSelectionnee === 'Toutes'
    ? eleves
    : eleves.filter(eleve => eleve.classe === classeSelectionnee);

  return (
    <div className="listeEtudiant">
      <h2>Liste des élèves</h2>
        <label htmlFor="classe">Sélectionnez une classe :</label>
        <select id="classe" value={classeSelectionnee} onChange={handleChange}>
          {classes.map((classe, index) => (
            <option key={index} value={classe}>{classe}</option>
          ))}
        </select>
        {etudiantsFiltres.map((eleve, index) => (
          <div key={index} className="etudiantCard">
            <p><strong>{eleve.prenom} {eleve.nom}</strong></p>
            <p>Âge : {eleve.age} ans</p>
            <p>Classe : {eleve.classe}</p>
          </div>
        ))}
    </div>
  );
};

export default ListeEtudiants;
