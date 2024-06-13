import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import enseignants from '../../Données/Etudiant';
import '../../style/Formulaire.css';

const AjouterEtudiant = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [classe, setClasse] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEnseignant = {
      nom,
      prenom,
      age: parseInt(age, 10),
      classe
    };
    enseignants.push(newEnseignant);
    navigate('/etudiant');
  };

  return (
    <div className="Add">
      <h2>Ajouter un étudiant</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div>
          <label>Prénom:</label>
          <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        </div>
        <div>
          <label>Âge:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Classe:</label>
          <input type="text" value={classe} onChange={(e) => setClasse(e.target.value)} required />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterEtudiant;
