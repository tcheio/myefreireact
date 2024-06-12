// import React from 'react';
// import { useParams } from 'react-router-dom';
// import etudiants from '../../Données/Etudiants';

// const EnseignantDetail = () => {
//   const { id } = useParams();
//   const enseignant = enseignants.find((ens, index) => index === parseInt(id, 10));

//   if (!enseignant) {
//     return <div>Enseignant non trouvé</div>;
//   }

//   return (
//     <div className="EnseignantDetail">
//       <h2>Détails de l'enseignant</h2>
//       <p>Nom : {enseignant.nom}</p>
//       <p>Prénom : {enseignant.prenom}</p>
//       <p>Âge : {enseignant.age} ans</p>
//       <p>Matière : {enseignant.matiere}</p>
//     </div>
//   );
// };

// export default EnseignantDetail;