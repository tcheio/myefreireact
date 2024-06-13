import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import planningsData from '../../Données/Planning';

const AjouterCours = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plannings, setPlannings] = useState(planningsData);
  const [newCourse, setNewCourse] = useState({ jour: '', cours: '', heure: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
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
    navigate(`/classe/${id}/planning`);
  };

  return (
    <div className="AjouterCours">
      <h4>Ajouter un nouveau cours :</h4>
      <form onSubmit={handleAddCourse}>
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
      <Link to={`/classe/${id}/planning`}>
        <button>Retour au planning</button>
      </Link>
    </div>
  );
};

export default AjouterCours;
