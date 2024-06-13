import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
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
import ListeActualites from './Components/Actualite/ListeActualites';
import ActualiteDetail from './Components/Actualite/ActualiteDetail';
import AjouterActualite from './Components/Actualite/AjouterActualite';

import Accueil from './vue/Accueil';
import Login from './vue/Login';
import { PlanningProvider } from './Context/PlanningContext';

import './App.css';

function App() {
  const isLoggedIn = localStorage.getItem('loggedIn');

  return (
    <PlanningProvider>
      <Router>
        <div className="App">
          {isLoggedIn && (
            <nav>
              <Link to="/">Home</Link>
              <Link to="/etudiant">Étudiants</Link>
              <Link to="/enseignants">Enseignants</Link>
              <Link to="/classes">Classes</Link>
              <Link to="/actualite">Actualités</Link>
            </nav>
          )}
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/accueil" /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/etudiant" element={<ListeEtudiants />} />
            <Route path="/etudiant/:id" element={<DetailEtudiants />} />
            <Route path="/etudiant/ajouter" element={<AjouterEtudiant />} />
            <Route path="/etudiant/:id/ajouter-note" element={<AjouterNote />} />
            <Route path="/enseignants" element={<ListeEnseignants />} />
            <Route path="/enseignants/:id" element={<EnseignantDetail />} />
            <Route path="/enseignants/ajouter" element={<AjouterEnseignant />} />
            <Route path="/classes" element={<ListeClasses />} />
            <Route path="/classes/:id" element={<ClasseDetail />} />
            <Route path="/classes/:id/planning" element={<ClassePlanning />} />
            <Route path="/classes/:id/ajouter-cours" element={<AjouterCours />} />
            <Route path="/actualite" element={<ListeActualites />} />
            <Route path="/actualite/:id" element={<ActualiteDetail />} />
            <Route path="/add-actualite" element={<AjouterActualite />} />
          </Routes>
        </div>
      </Router>
    </PlanningProvider>
  );
}

export default App;
