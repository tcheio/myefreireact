import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import actualites from '../../Données/Actualite';

const AjouterActualite = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActualite = {
      titre,
      description,
      date,
      type
    };
    actualites.push(newActualite);
    navigate('/actualite');
  };

  return (
    <div className="AddActualite">
      <h2>Ajouter une actualité</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Type:</label>
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterActualite;
