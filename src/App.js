import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Accueil from './Components/Accueil';
import ListeEtudiants from './Components/ListeEtudiants';
import ListeEnseignants from './Components/Enseignants/ListeEnseignants';
import EnseignantDetail from './Components/Enseignants/EnseignantDetail';
import AjouterEnseignant from './Components/Enseignants/AjouterEnseignant';
import Classes from './Components/Classes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/etudiant" element={<ListeEtudiants />} />
            <Route path="/enseignant" element={<ListeEnseignants />} />
            <Route path="/enseignants/:id" element={<EnseignantDetail />} />
            <Route path="/add-enseignant" element={<AjouterEnseignant />} />
            <Route path="/classes" element={<Classes />} />
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
