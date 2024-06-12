import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Accueil from './Components/Accueil';
import ListeEnseignants from './Components/Enseignants/ListeEnseignants';
import EnseignantDetail from './Components/Enseignants/EnseignantDetail';
import AjouterEnseignant from './Components/Enseignants/AjouterEnseignant';
import ListeEtudiants from './Components/Etudiants/ListeEtudiants';
import DetailEtudiants from './Components/Etudiants/DetailEtudiants';
import ListeClasses from './Components/Classes/ListeClasses';
import ClasseDetail from './Components/Classes/ClasseDetail';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/etudiant" element={<ListeEtudiants />} />
            <Route path="/etudiant/:id" element={<DetailEtudiants />} />
            <Route path="/enseignant" element={<ListeEnseignants />} />
            <Route path="/enseignants/:id" element={<EnseignantDetail />} />
            <Route path="/add-enseignant" element={<AjouterEnseignant />} />
            <Route path="/classes" element={<ListeClasses />} />
            <Route path="/classes/:id" element={<ClasseDetail />} />
          </Routes>
          <nav>
            <Link to="/">Home</Link>
          </nav>
        </main>
      </div>
    </Router>
  );
}

export default App;
