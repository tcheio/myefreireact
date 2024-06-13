import React, { useState } from 'react';
import etudiantsData from '../../Données/Etudiant';
import classesIndex from '../../Données/Classes';
import { Link } from 'react-router-dom';
import '../../style/Profil.css';

const ListeEtudiants = () => {
  const [classeSelectionnee, setClasseSelectionnee] = useState('Classes');
  const [etudiants, setEtudiants] = useState(etudiantsData);

  const classes = ['Classes', ...new Set(classesIndex.map(classe => classe.nom))];

  const handleChange = (event) => {
    setClasseSelectionnee(event.target.value);
  };

  const etudiantsFiltres = classeSelectionnee === 'Classes'
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
    <div className="liste">
      <h2>Liste des élèves</h2>
      <Link to="/etudiant/ajouter">
        <button className="Boutonadd">Ajouter un étudiant</button>
      </Link>
      <label htmlFor="classe">Sélectionnez une classe :</label>
      <select id="classe" value={classeSelectionnee} onChange={handleChange}>
        {classes.map((classe, index) => (
          <option key={index} value={classe}>{classe}</option>
        ))}
      </select>
      <div className="grid">
        {etudiantsFiltres.map((etudiant, index) => (
          <div key={index} className="card">
            <Link to={`/etudiant/${index}`}><p><strong>{etudiant.prenom} {etudiant.nom}</strong></p></Link>
            <p>Âge : {etudiant.age} ans</p>
            <p>Classe : {getClasseNom(etudiant.classesId)}</p>
            <button onClick={() => supprimerEtudiant(index)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeEtudiants;
