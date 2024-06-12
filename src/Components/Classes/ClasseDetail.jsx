import React from 'react';
import { useParams } from 'react-router-dom';
import classes from '../../Données/Classes';
import etudiants from '../../Données/Etudiant';
import plannings from '../../Données/Planning';

const ClasseDetail = () => {
  const { id } = useParams();
  const classe = classes.find(classe => classe.id === parseInt(id, 10));
  const elevesInClasse = etudiants.filter(eleve => eleve.classesId === parseInt(id, 10));
  const planningClasse = plannings.find(planning => planning.classeId === parseInt(id, 10));

  if (!classe) {
    return <div>Classe non trouvée</div>;
  }

  return (
    <div className="ClasseDetail">
      <h2>{classe.nom}</h2>
      <h3>Professeur référent : {classe.professeur}</h3>
      <h4>Liste des étudiants :</h4>
      <ul>
        {elevesInClasse.map((eleve, index) => (
          <li key={index}>
            {eleve.prenom} {eleve.nom}, {eleve.age} ans
          </li>
        ))}
      </ul>
      <h4>Planning des cours :</h4>
      {planningClasse ? (
        <ul>
          {planningClasse.planning.map((cours, index) => (
            <li key={index}>
              {cours.jour} - {cours.cours} : {cours.heure}
            </li>
          ))}
        </ul>
      ) : (
        <p>Pas de planning disponible pour cette classe.</p>
      )}
    </div>
  );
};

export default ClasseDetail;
