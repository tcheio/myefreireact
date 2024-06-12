import React from 'react';
import { useParams } from 'react-router-dom';
import classes from '../../Données/Classes';
import etudiants from '../../Données/Etudiant';

const ClasseDetail = () => {
  const { id } = useParams();
  const classeId = parseInt(id, 10);

  console.log("Classe ID from useParams:", classeId);
  
  const classe = classes.find(classe => classe.id === classeId);
  const elevesInClasse = etudiants.filter(eleve => eleve.classesId === classeId);

  console.log("Classe trouvée:", classe);
  console.log("Étudiants dans la classe:", elevesInClasse);

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
    </div>
  );
};

export default ClasseDetail;
