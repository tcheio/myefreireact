import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Accueil from './Components/Accueil';
import ListeEtudiants from './Components/Etudiants/ListeEtudiants';
import ListeEnseignants from './Components/ListeEnseignants';
import Classes from './Components/Classes';
import './App.css';
import DetailEtudiants from './Components/Etudiants/DetailEtudiants';

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
