import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlanningContext } from '../../Context/PlanningContext';

const ClassePlanning = () => {
  const { id } = useParams();
  const { plannings } = useContext(PlanningContext);
  const planningClasse = plannings.find(planning => planning.classeId === parseInt(id, 10));

  return (
    <div className="ClassePlanning">
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
      <Link to={`/classe/${id}/ajouter-cours`}>
        <button>Ajouter un cours</button>
      </Link>
    </div>
  );
};

export default ClassePlanning;