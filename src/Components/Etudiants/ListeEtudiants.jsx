import React, { useState } from 'react';
import etudiants from '../../Données/Etudiant';
import './ListeEtudiants.css';
import { Link } from 'react-router-dom';

const ListeEtudiants = () => {
  const [classeSelectionnee, setClasseSelectionnee] = useState('Toutes');

  const classes = ['Toutes', ...new Set(etudiants.map(etudiant => etudiant.classe))];

  const handleChange = (event) => {
    setClasseSelectionnee(event.target.value);
  };

  const etudiantsFiltres = classeSelectionnee === 'Toutes'
    ? etudiants
    : etudiants.filter(etudiant => etudiant.classe === classeSelectionnee);

  return (
    <div className="listeEtudiant">
      <h2>Liste des élèves</h2>
        <label htmlFor="classe">Sélectionnez une classe :</label>
        <select id="classe" value={classeSelectionnee} onChange={handleChange}>
          {classes.map((classe, index) => (
            <option key={index} value={classe}>{classe}</option>
          ))}
        </select>
        {etudiantsFiltres.map((etudiant, index) => (
          <div key={index} className="etudiantCard">
            <Link to={`/etudiant/${index}`}><p><strong>{etudiant.prenom} {etudiant.nom}</strong></p></Link>
            <p>Âge : {etudiant.age} ans</p>
            <p>Classe : {etudiant.classe}</p>
          </div>
        ))}
    </div>
  );
};

export default ListeEtudiants;

