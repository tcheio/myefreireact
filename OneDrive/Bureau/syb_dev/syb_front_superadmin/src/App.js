import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AddSectorPage from './pages/AddSectorPage';
import AddCategoryPage from './pages/AddCategoryPage';
import AddCompanyPage from './pages/AddCompanyPage'; // ✅ Nouvelle page
import AddInsurerPage from './pages/AddInsurerPage';
import AddInsurancePage from './pages/AddInsurancePage';
import AddUserPage from './pages/AddUserPage';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/current-user', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("❌ Erreur récupération utilisateur:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        setUser(null);
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <Router>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route element={<ProtectedRoute user={user} />} >
                    <Route element={<DashboardLayout user={user} onLogout={handleLogout} />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/ajouter-secteur" element={<AddSectorPage />} />
                        <Route path="/ajouter-categorie" element={<AddCategoryPage />} />
                        <Route path="/ajouter-entreprise" element={<AddCompanyPage />} />
                        <Route path="/ajouter-assureur" element={<AddInsurerPage />} />
                        <Route path="/ajouter-assurance" element={<AddInsurancePage />} /> 
                        <Route path="/ajouter-utilisateur" element={<AddUserPage />} /> 
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
