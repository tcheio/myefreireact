import React, { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PlanningContext } from '../../Context/PlanningContext';

const AjouterCours = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePlanning } = useContext(PlanningContext);
  const [newCourse, setNewCourse] = useState({ jour: '', cours: '', heure: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    updatePlanning(parseInt(id, 10), newCourse);
    setNewCourse({ jour: '', cours: '', heure: '' });
    navigate(`/classes/${id}/planning`);
  };

  return (
    <div className="Add">
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
      <Link to={`/classes/${id}/planning`}>
        <button>Retour au planning</button>
      </Link>
    </div>
  );
};

export default AjouterCours;
