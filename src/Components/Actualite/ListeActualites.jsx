import React, { useState } from 'react';
import actualitesData from '../../Données/Actualite';
import { Link } from 'react-router-dom';
import '../../style/Profil.css';

const ListeActualites = () => {
  const [actualites, setActualites] = useState(actualitesData);

  const supprimerActualite = (index) => {
    const nouvelleListeActualites = [...actualites];
    nouvelleListeActualites.splice(index, 1);
    setActualites(nouvelleListeActualites);
  };

  return (
    <div className="liste">
      <h2>Liste des actualités</h2>
      <Link to="/add-actualite">
        <button className="Boutonadd">Ajouter une actualité</button>
      </Link>
      <div className='grid'>
        {actualites.map((actualite, index) => (
          <div key={index} className="card">
            <Link to={`/actualite/${index}`}><p><strong>{actualite.titre}</strong></p></Link>
            <button onClick={() => supprimerActualite(index)}>Supprimer</button>
          </div>
      ))}
      </div>
    </div>
  );
};

export default ListeActualites;
