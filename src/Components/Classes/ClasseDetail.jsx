import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from '../../Données/Classes';
import etudiants from '../../Données/Etudiant';
import planningsData from '../../Données/Planning';

const ClasseDetail = () => {
  const { id } = useParams();
  const classe = classes.find(classe => classe.id === parseInt(id, 10));
  const elevesInClasse = etudiants.filter(eleve => eleve.classesId === parseInt(id, 10));
  const [plannings, setPlannings] = useState(planningsData);
  const [newCourse, setNewCourse] = useState({ jour: '', cours: '', heure: '' });

  if (!classe) {
    return <div>Classe non trouvée</div>;
  }

  const planningClasse = plannings.find(planning => planning.classeId === parseInt(id, 10));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleAddCourse = () => {
    const updatedPlannings = plannings.map(planning => {
      if (planning.classeId === parseInt(id, 10)) {
        return {
          ...planning,
          planning: [...planning.planning, newCourse]
        };
      }
      return planning;
    });

    setPlannings(updatedPlannings);
    setNewCourse({ jour: '', cours: '', heure: '' });
  };

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

      <h4>Ajouter un nouveau cours :</h4>
      <form onSubmit={(e) => { e.preventDefault(); handleAddCourse(); }}>
        <div>
          <label htmlFor="jour">Jour :</label>
          <input
            type="text"
            id="jour"
            name="jour"
            value={newCourse.jour}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cours">Cours :</label>
          <input
            type="text"
            id="cours"
            name="cours"
            value={newCourse.cours}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="heure">Heure :</label>
          <input
            type="text"
            id="heure"
            name="heure"
            value={newCourse.heure}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default ClasseDetail;