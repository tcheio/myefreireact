import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, List, ListItem, ListItemText, Paper, Grid, Divider, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const AddCategoryPage = () => {
    const [name, setName] = useState('');
    const [sectorId, setSectorId] = useState('');
    const [sectors, setSectors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSectors();
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) throw new Error("Impossible de récupérer les catégories.");
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name.trim() || !sectorId) {
            return setError("Le nom et le secteur sont requis.");
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, sector_id: sectorId })
            });

            if (!response.ok) {
                if (response.status === 400) throw new Error("Nom ou secteur invalide.");
                throw new Error("Erreur lors de l'ajout de la catégorie.");
            }

            setSuccess("Catégorie ajoutée avec succès !");
            setName('');
            setSectorId('');
            fetchCategories(); // 🔥 Mise à jour immédiate des catégories
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Catégories
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* ✅ FORMULAIRE - 2/3 DE L'ÉCRAN */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 4, backgroundColor: "#fff", borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Ajouter une Catégorie
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Nom de la catégorie"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ backgroundColor: "white", borderRadius: 1 }}
                                disabled={loading}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Secteur</InputLabel>
                                <Select
                                    value={sectorId}
                                    onChange={(e) => setSectorId(e.target.value)}
                                    disabled={loading}
                                >
                                    {sectors.map((sector) => (
                                        <MenuItem key={sector.id} value={sector.id}>
                                            {sector.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Ajouter"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* ✅ LISTE DES CATÉGORIES - 1/3 DE L'ÉCRAN */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Liste des Catégories
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                <ListItem key={category.id} sx={{ borderBottom: '1px solid #ddd' }}>
                                    <ListItemText
                                    primary={`${category.name} (Secteur: ${category.Sector ? category.Sector.name : "Non défini"})`}
                                    />
                                </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2">Aucune catégorie disponible.</Typography>
                            )}
                            </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AddCategoryPage;
