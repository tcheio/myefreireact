import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginData from '../Données/Login';
import '../style/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = loginData.find(user => user.username === username && user.password === password);
    if (user) {
      localStorage.setItem('loggedIn', true);
      navigate('/accueil');
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src="https://auth.myefrei.fr/static/media/logo-efrei.65d4f0ab.png" alt="Efrei Logo" className="logo" />
        <form onSubmit={handleLogin}>
          <h2 className="login-title">Connexion</h2>
          <h3 className="login-subtitle">Utiliser votre compte Efrei</h3>
          <div className="form-group">
            <label htmlFor="username">Identifiant (username) :</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">SE CONNECTER</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
