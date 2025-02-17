import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, List, ListItem, ListItemText, Paper, Grid, Divider, CircularProgress } from '@mui/material';

const AddSectorPage = () => {
    const [name, setName] = useState('');
    const [sectors, setSectors] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSectors();
    }, []);

    const fetchSectors = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/sectors');
            if (!response.ok) throw new Error(`Erreur ${response.status} : Impossible de récupérer les secteurs.`);
            const data = await response.json();
            setSectors(data.sectors);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!name.trim()) return setError("Le nom du secteur est requis.");

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/sectors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (!response.ok) {
                if (response.status === 400) throw new Error("Nom du secteur invalide.");
                throw new Error("Erreur lors de l'ajout du secteur.");
            }

            setSuccess("Secteur ajouté avec succès !");
            setName('');
            fetchSectors(); // 🔥 Mise à jour immédiate des secteurs
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Secteurs
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            {/* ✅ Répartition du contenu : Formulaire (2/3) | Liste (1/3) */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* ✅ FORMULAIRE - 2/3 DE L'ÉCRAN */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 4, backgroundColor: "#fff", borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Ajouter un Secteur
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Nom du secteur"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ backgroundColor: "white", borderRadius: 1 }}
                                disabled={loading}
                            />
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Ajouter"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* ✅ LISTE DES SECTEURS - 1/3 DE L'ÉCRAN */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Liste des Secteurs
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List>
                                {sectors.length > 0 ? (
                                    sectors.map((sector) => (
                                        <ListItem key={sector.id} sx={{ borderBottom: '1px solid #ddd' }}>
                                            <ListItemText primary={sector.name} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2">Aucun secteur disponible.</Typography>
                                )}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AddSectorPage;
