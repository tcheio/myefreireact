import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Accueil from './Components/Accueil';
import ListeEnseignants from './Components/Enseignants/ListeEnseignants';
import EnseignantDetail from './Components/Enseignants/EnseignantDetail';
import AjouterEnseignant from './Components/Enseignants/AjouterEnseignant';
import ListeEtudiants from './Components/Etudiants/ListeEtudiants';
import DetailEtudiants from './Components/Etudiants/DetailEtudiants';
import AjouterEtudiant from './Components/Etudiants/AjouterEtudiant';
import AjouterNote from './Components/Etudiants/AjouterNote';
import ListeClasses from './Components/Classes/ListeClasses';
import ClasseDetail from './Components/Classes/ClasseDetail';
import ClassePlanning from './Components/Classes/ClassesPlanning';
import AjouterCours from './Components/Classes/AjouterCours';
import { PlanningProvider } from './Context/PlanningContext';

import './App.css';

function App() {
  return (
    <PlanningProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/etudiant" element={<ListeEtudiants />} />
            <Route path="/etudiant/:id" element={<DetailEtudiants />} />
            <Route path="/etudiant/ajouter" element={<AjouterEtudiant />} />
            <Route path="/etudiant/:id/ajouter-note" element={<AjouterNote />} />
            <Route path="/enseignant" element={<ListeEnseignants />} />
            <Route path="/enseignant/:id" element={<EnseignantDetail />} />
            <Route path="/enseignant/ajouter" element={<AjouterEnseignant />} />
            <Route path="/classes" element={<ListeClasses />} />
            <Route path="/classes/:id" element={<ClasseDetail />} />
            <Route path="/classes/:id/planning" element={<ClassePlanning />} />
            <Route path="/classes/:id/ajouter-cours" element={<AjouterCours />} />
          </Routes>

          <nav>
            <Link to="/">Home</Link>
          </nav>

        </div>
      </Router>
    </PlanningProvider>
  );
}

export default App;
