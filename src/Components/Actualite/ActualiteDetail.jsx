import React from 'react';
import { useParams } from 'react-router-dom';
import actualites from '../../Données/Actualite';

const ActualiteDetail = () => {
  const { id } = useParams();
  const actualite = actualites.find((ens, index) => index === parseInt(id, 10));

  if (!actualite) {
    return <div>Actualité non trouvé</div>;
  }

  return (
    <div className="ActualiteDetail">
      <h2>Détails de l'actualité</h2>
      <p>Titre : {actualite.titre}</p>
      <p>Description : {actualite.description}</p>
      <p>Date : {actualite.date}</p>
      <p>Type : {actualite.type}</p>
    </div>
  );
};

export default ActualiteDetail;
