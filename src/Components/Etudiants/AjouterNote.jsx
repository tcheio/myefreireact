import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import etudiants from '../../Données/Etudiant';

const AjouterNote = () => {
  const { id } = useParams();
  const etudiantIndex = parseInt(id, 10);
  const navigate = useNavigate();

  const [maths, setMaths] = useState('');
  const [francais, setFrancais] = useState('');
  const [sciences, setSciences] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (etudiantIndex >= 0 && etudiantIndex < etudiants.length) {
      const etudiant = etudiants[etudiantIndex];
      etudiant.notes = {
        Mathematiques: maths ? parseFloat(maths) : etudiant.notes.Mathematiques,
        Francais: francais ? parseFloat(francais) : etudiant.notes.Francais,
        Sciences: sciences ? parseFloat(sciences) : etudiant.notes.Sciences,
      };
      navigate(`/etudiant/${id}`);
    }
  };

  return (
    <div className="Add">
      <h2>Ajouter une note</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mathématiques:</label>
          <input
            type="number"
            step="0.1"
            value={maths}
            onChange={(e) => setMaths(e.target.value)}
          />
        </div>
        <div>
          <label>Français:</label>
          <input
            type="number"
            step="0.1"
            value={francais}
            onChange={(e) => setFrancais(e.target.value)}
          />
        </div>
        <div>
          <label>Sciences:</label>
          <input
            type="number"
            step="0.1"
            value={sciences}
            onChange={(e) => setSciences(e.target.value)}
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterNote;
