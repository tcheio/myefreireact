import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import enseignants from '../../Données/Enseignant';

const AjouterEnseignant = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [matiere, setMatiere] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEnseignant = {
      nom,
      prenom,
      age: parseInt(age, 10),
      matiere
    };
    enseignants.push(newEnseignant);
    navigate('/enseignants');
  };

  return (
    <div className="AddEnseignant">
      <h2>Ajouter un enseignant</h2>
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
          <label>Matière:</label>
          <input type="text" value={matiere} onChange={(e) => setMatiere(e.target.value)} required />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterEnseignant;
