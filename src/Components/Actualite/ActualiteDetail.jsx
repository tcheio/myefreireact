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
    <div className="Detail">
      <h2>Détails de l'actualité</h2>
      <p className='left'><strong>Titre :</strong> {actualite.titre}</p>
      <p className='left'><strong>Description :</strong> {actualite.description}</p>
      <p className='left'><strong>Date :</strong> {actualite.date}</p>
      <p className='left'><strong>Type :</strong> {actualite.type}</p>
    </div>
  );
};

export default ActualiteDetail;
