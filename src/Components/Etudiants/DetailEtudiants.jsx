import React from 'react';
import { useParams, Link } from 'react-router-dom';
import etudiants from '../../Données/Etudiant';

const DetailEtudiants = () => {
  const { id } = useParams();
  const etudiant = etudiants.find((ens, index) => index === parseInt(id, 10));

  if (!etudiant) {
    return <div>Etudiant non trouvé</div>;
  }

  return (
    <div className="DetailEtudiants">
      <h2>Détails de l'étudiant</h2>
      <p>Nom : {etudiant.nom}</p>
      <p>Prénom : {etudiant.prenom}</p>
      <p>Âge : {etudiant.age} ans</p>
      <p>Classe : {etudiant.classe}</p>
      
      <h3>Notes:</h3>
      {etudiant.notes ? (
        <table>
          <thead>
            <tr>
              <th>Matière</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(etudiant.notes).map((matiere) => (
              <tr key={matiere}>
                <td>{matiere}</td>
                <td>{etudiant.notes[matiere] !== null ? etudiant.notes[matiere] : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune note disponible</p>
      )}

      <Link to={`/add-note/${id}`}>
        <button>Ajouter une note</button>
      </Link>
    </div>
  );
};

export default DetailEtudiants;
