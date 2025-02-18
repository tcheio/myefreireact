import React, { useState, useEffect } from 'react';
import { 
    Container, TextField, Button, Typography, Box, Alert, List, ListItem, ListItemText, Paper, 
    Grid, Divider, CircularProgress, MenuItem, Select, FormControl, InputLabel, IconButton, InputAdornment
} from '@mui/material';
import { Edit, Add, Delete, Backspace, Search } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const AddInsurerPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [insurers, setInsurers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        siret: "",
        orias: "",
        status_id: "",
        sector_id: "",
        type_voie: "",
        voie: "",
        nr_voie: "",
        nr_locale: "",
        code_postal: "",
        ville: "",
        pays: ""
    });
    const [selectedInsurerId, setSelectedInsurerId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchInsurers(), fetchStatuses(), fetchSectors()]);
        };
        fetchData();
    }, []);

    const fetchInsurers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/insurers');
            if (!response.ok) throw new Error("Impossible de récupérer les assureurs.");
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setInsurers(data);
            } else if (data.insurers && Array.isArray(data.insurers)) {
                setInsurers(data.insurers);
            } else {
                throw new Error("Format de réponse inattendu");
            }
        } catch (error) {
            setError(error.message);
            setInsurers([]); // S'assurer que insurers est toujours un tableau
        }
    };
    

    const fetchStatuses = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/statuses');
            if (!response.ok) throw new Error("Impossible de récupérer les statuts.");
            const data = await response.json();
            setStatuses(data.statuses);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchSectors = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/sectors');
            if (!response.ok) throw new Error("Impossible de récupérer les secteurs.");
            const data = await response.json();
            setSectors(data.sectors);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        if (!formData.name.trim() || !formData.siret || !formData.orias) {
            return setError("Tous les champs obligatoires doivent être remplis.");
        }
    
        setLoading(true);
        try {
            const response = await fetch(
                selectedInsurerId 
                    ? `http://localhost:3000/api/insurers/${selectedInsurerId}` 
                    : 'http://localhost:3000/api/insurers', 
                {
                    method: selectedInsurerId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            );
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || `Erreur API: ${response.status}`);
            }
    
            setSuccess(selectedInsurerId ? "Assureur mis à jour !" : "Assureur ajouté !");
            resetForm();
            fetchInsurers();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleEditInsurer = async (insurerId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/insurers/${insurerId}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération des détails de l'assureur.");
    
            const data = await response.json();
    
            if (!data || !data.insurer) throw new Error("Format de données invalide.");
    
            setFormData({
                name: data.insurer.name || "",
                siret: data.insurer.siret || "",
                orias: data.insurer.orias || "",
                status_id: data.insurer.status_id || "",
                sector_id: data.insurer.sector_id || "",
                type_voie: data.insurer.type_voie || "",
                voie: data.insurer.voie || "",
                nr_voie: data.insurer.nr_voie || "",
                nr_locale: data.insurer.nr_locale || "",
                code_postal: data.insurer.code_postal || "",
                ville: data.insurer.ville || "",
                pays: data.insurer.pays || ""
            });
    
            setSelectedInsurerId(insurerId);
        } catch (error) {
            setError(error.message);
        }
    };
    

    const resetForm = () => {
        setFormData({
            name: "",
            siret: "",
            orias: "",
            status_id: "",
            sector_id: "",
            type_voie: "",
            voie: "",
            nr_voie: "",
            nr_locale: "",
            code_postal: "",
            ville: "",
            pays: ""
        });
        setSelectedInsurerId(null);
        setError('');
        setSuccess('');
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Assureurs
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6">{selectedInsurerId ? "Modifier un Assureur" : "Ajouter un Assureur"}</Typography>
                            {selectedInsurerId && (
                                <IconButton onClick={resetForm} color="primary">
                                    <Backspace />
                                </IconButton>
                            )}
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Nom de l'assureur" fullWidth name="name" value={formData.name} onChange={handleChange} />
                            <TextField label="SIRET" fullWidth name="siret" value={formData.siret} onChange={handleChange} />
                            <TextField label="ORIAS" fullWidth name="orias" value={formData.orias} onChange={handleChange} />
                            <TextField label="Type de voie" fullWidth name="type_voie" value={formData.type_voie} onChange={handleChange} />
                            <TextField label="Voie" fullWidth name="voie" value={formData.voie} onChange={handleChange} />
                            <TextField label="Numéro de voie" fullWidth name="nr_voie" value={formData.nr_voie} onChange={handleChange} />
                            <TextField label="Numéro local" fullWidth name="nr_locale" value={formData.nr_locale} onChange={handleChange} />
                            <TextField label="Code postal" fullWidth name="code_postal" value={formData.code_postal} onChange={handleChange} />
                            <TextField label="Ville" fullWidth name="ville" value={formData.ville} onChange={handleChange} />
                            <TextField label="Pays" fullWidth name="pays" value={formData.pays} onChange={handleChange} />
                                                        
                            <FormControl fullWidth>
                                <InputLabel>Secteur</InputLabel>
                                <Select name="sector_id" value={formData.sector_id} onChange={handleChange}>
                                    {sectors.map(sector => <MenuItem key={sector.id} value={sector.id}>{sector.name}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select name="status_id" value={formData.status_id} onChange={handleChange}>
                                    {statuses.map(status => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <Button type="submit" variant="contained" color="primary">
                                {loading ? <CircularProgress size={24} color="inherit" /> : selectedInsurerId ? "Modifier" : "Ajouter"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">Assureurs</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Rechercher par nom ou SIRET..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <List>
                            {insurers
                                .filter(insurer =>
                                    insurer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    insurer.siret.includes(searchTerm) // Vérifie si le SIRET contient la recherche
                                )
                                .map(insurer => (
                                    <ListItem key={insurer.id}>
                                        <ListItemText primary={insurer.name} secondary={`SIRET: ${insurer.siret}`} />
                                        <IconButton onClick={() => handleEditInsurer(insurer.id)}><Edit /></IconButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AddInsurerPage;