import React from 'react';
import { useParams } from 'react-router-dom';
import etudiants from '../../Données/Etudiant';

const DetailEtudiants = () => {
  const { id } = useParams();
  const etudiant = etudiants.find((ens, index) => index === parseInt(id, 10));

  if (!etudiant) {
    return <div>Etudiant non trouvé</div>;
  }

  return (
    <div className="DetailEtudiants">
      <h2>Détails de l'etudiant</h2>
      <p>Nom : {etudiant.nom}</p>
      <p>Prénom : {etudiant.prenom}</p>
      <p>Âge : {etudiant.age} ans</p>
      <p>classe : {etudiant.classe}</p>
    </div>
  );
};

export default DetailEtudiants;

