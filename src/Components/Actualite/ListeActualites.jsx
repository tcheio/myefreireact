import React, { useState } from 'react';
import actualitesData from '../../Données/Actualite';
import { Link } from 'react-router-dom';

const ListeActualites = () => {
  const [actualites, setActualites] = useState(actualitesData);

  const supprimerActualite = (index) => {
    const nouvelleListeActualites = [...actualites];
    nouvelleListeActualites.splice(index, 1);
    setActualites(nouvelleListeActualites);
  };

  return (
    <div className="listeActualites">
      <h2>Liste des actualités</h2>
      {actualites.map((actualite, index) => (
        <div key={index} className="actualiteCard">
          <Link to={`/actualite/${index}`}><p><strong>{actualite.titre}</strong></p></Link>
          <button onClick={() => supprimerActualite(index)}>Supprimer</button>
        </div>
      ))}
      <Link to="/add-actualite">
        <button>Ajouter une actualité</button>
      </Link>
    </div>
  );
};

export default ListeActualites;
