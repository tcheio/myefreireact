import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

const LoginPage = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
          const response = await fetch('http://localhost:3000/api/auth/superadmin/login', {
              method: 'POST',
              credentials: 'include', // 🔥 Envoie et reçoit les cookies
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
  
          if (!response.ok) {
              throw new Error('Échec de la connexion');
          }
  
          const data = await response.json();
          setUser(data.user);
          navigate('/');
      } catch (err) {
          setError(err.message);
      }
  };
  
  

    return (
        <Container component="main" maxWidth="xs">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                <Typography variant="h4" gutterBottom>SuperAdmin Login</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: '100%' }}>
                    <TextField label="Email" variant="outlined" fullWidth margin="normal"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextField label="Mot de passe" variant="outlined" fullWidth type="password" margin="normal"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                        Connexion
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
