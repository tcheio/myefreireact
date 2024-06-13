import React, { useState } from 'react';
import etudiantsData from '../../Données/Etudiant';
import classesIndex from '../../Données/Classes';
import { Link } from 'react-router-dom';

const ListeEtudiants = () => {
  const [classeSelectionnee, setClasseSelectionnee] = useState('Toutes');
  const [etudiants, setEtudiants] = useState(etudiantsData);

  const classes = ['Toutes', ...new Set(classesIndex.map(classe => classe.nom))];

  const handleChange = (event) => {
    setClasseSelectionnee(event.target.value);
  };

  const etudiantsFiltres = classeSelectionnee === 'Toutes'
    ? etudiants
    : etudiants.filter(etudiant => {
        const classe = classesIndex.find(classe => classe.id === etudiant.classesId);
        return classe && classe.nom === classeSelectionnee;
      });

  const getClasseNom = (classesId) => {
    const classe = classesIndex.find(classe => classe.id === classesId);
    return classe ? classe.nom : 'Non attribué';
  };

  const supprimerEtudiant = (index) => {
    const nouvelleListeEtudiants = [...etudiants];
    nouvelleListeEtudiants.splice(index, 1);
    setEtudiants(nouvelleListeEtudiants);
  };

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
          <p>Classe : {getClasseNom(etudiant.classesId)}</p>
          <button onClick={() => supprimerEtudiant(index)}>Supprimer</button>
        </div>
      ))}
      <Link to="/etudiant/ajouter">
        <button>Ajouter un étudiant</button>
      </Link>
    </div>
  );
};

export default ListeEtudiants;
