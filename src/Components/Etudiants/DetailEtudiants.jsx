import React from 'react';
import { useParams, Link } from 'react-router-dom';
import etudiants from '../../Données/Etudiant';
import classesIndex from '../../Données/Classes';
import '../../style/Detail.css';

const DetailEtudiants = () => {
  const { id } = useParams();
  const etudiant = etudiants.find((ens, index) => index === parseInt(id, 10));

  if (!etudiant) {
    return <div>Etudiant non trouvé</div>;
  }

  const moyennenote = (notes) => {
    const validNotes = Object.values(notes).filter(note => note !== null);
    const sum = validNotes.reduce((acc, note) => acc + note, 0);
    return validNotes.length > 0 ? (sum / validNotes.length).toFixed(2) : 'N/A';
  };

  const getClasseNom = (classesId) => {
    const classe = classesIndex.find(classe => classe.id === classesId);
    return classe ? classe.nom : 'Non attribué';
  };

  const moyenneGenerale = etudiant.notes ? moyennenote(etudiant.notes) : 'N/A';

  return (
    <div className="Detail">
      <h2>Détails de l'étudiant</h2>
      <p>Nom : {etudiant.nom}</p>
      <p>Prénom : {etudiant.prenom}</p>
      <p>Âge : {etudiant.age} ans</p>
      <p>Classe : {getClasseNom(etudiant.classesId)}</p>
      
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
            <tr>
              <td><strong>Moyenne générale</strong></td>
              <td><strong>{moyenneGenerale}</strong></td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Aucune note disponible</p>
      )}

      <Link to={`/etudiant/${id}/ajouter-note`}>
        <button>Ajouter une note</button>
      </Link>
    </div>
  );
};

export default DetailEtudiants;
