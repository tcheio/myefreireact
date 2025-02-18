import React, { useState, useEffect } from 'react';
import { 
    Container, TextField, Button, Typography, Box, Alert, List, ListItem, ListItemText, Paper, 
    Grid, Divider, CircularProgress, MenuItem, Select, FormControl, InputLabel, IconButton, InputAdornment,
    Checkbox, FormControlLabel
} from '@mui/material';
import { Edit, Add, Delete, Backspace, Search } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const AddInsurancePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [insurances, setInsurances] = useState([]);
    const [insurers, setInsurers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        engagement: "",
        name: "",
        price: "",
        insurer_id: "",
        category_id: "",
        description: "",
        sector_id: "",
        status_id: "",
        price_bike_minimum: "",
        vol: false,
        tentative_vol: false,
        dommages_materiels: false,
        catastrophes_naturelles: false,
        catastrophes_technologiques: false,
        vol_franchise: "",
        tentative_vol_franchise: "",
        dommages_materiels_franchise: "",
        catastrophes_naturelles_franchise: "",
        catastrophes_technologiques_franchise: "",
        min_fr_vol: "",
        min_fr_tentative_vol: "",
        min_fr_dommages_materiels: "",
        min_fr_catastrophes_naturelles: "",
        min_fr_catastrophes_technologiques: "",
        pdf_notice: "",
        pdf_ipid: ""
    });
    
    const [selectedInsuranceId, setSelectedInsuranceId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchInsurances(),
                fetchInsurers(),
                fetchStatuses(),
                fetchSectors(),
                fetchCategories()
            ]);
        };
        fetchData();
    }, []);

    const fetchInsurances = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/insurances');
            if (!response.ok) throw new Error("Impossible de récupérer les assurances.");
            const data = await response.json();
    
            setInsurances(data.insurances || []);
        } catch (error) {
            setError(error.message);
            setInsurances([]);
        }
    };
    

    const fetchInsurers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/insurers');
            if (!response.ok) throw new Error("Impossible de récupérer les assureurs.");
            const data = await response.json();
            setInsurers(data.insurers || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/statuses');
            if (!response.ok) throw new Error("Impossible de récupérer les statuts.");
            const data = await response.json();
            setStatuses(data.statuses || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchSectors = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/sectors');
            if (!response.ok) throw new Error("Impossible de récupérer les secteurs.");
            const data = await response.json();
            setSectors(data.sectors || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) throw new Error("Impossible de récupérer les catégories.");
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
    
        try {
            const formDataToSend = new FormData();
    
            // Ajout de toutes les valeurs texte
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== "" && formData[key] !== null && key !== "pdf_notice" && key !== "pdf_ipid") {
                    formDataToSend.append(key, formData[key]);
                }
            });
    
            // Ajout des fichiers PDF
            if (formData.pdf_notice) {
                formDataToSend.append("pdf_notice", formData.pdf_notice);
            }
            if (formData.pdf_ipid) {
                formDataToSend.append("pdf_ipid", formData.pdf_ipid);
            }
    
            const response = await fetch(
                selectedInsuranceId
                    ? `http://localhost:3000/api/insurances/${selectedInsuranceId}`
                    : 'http://localhost:3000/api/insurances',
                {
                    method: selectedInsuranceId ? 'PUT' : 'POST',
                    body: formDataToSend // Ne pas définir `Content-Type`, FormData le gère automatiquement
                }
            );
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || `Erreur API: ${response.status}`);
            }
    
            setSuccess(selectedInsuranceId ? "Assurance mise à jour !" : "Assurance ajoutée !");
            resetForm();
            fetchInsurances();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    

    const resetForm = () => {
        setFormData({
            engagement: "",
            name: "",
            price: "",
            insurer_id: "",
            category_id: "",
            description: "",
            sector_id: "",
            status_id: "",
            price_bike_minimum: "",
            vol: false,
            tentative_vol: false,
            dommages_materiels: false,
            catastrophes_naturelles: false,
            catastrophes_technologiques: false,
            vol_franchise: "",
            tentative_vol_franchise: "",
            dommages_materiels_franchise: "",
            catastrophes_naturelles_franchise: "",
            catastrophes_technologiques_franchise: "",
            min_fr_vol: "",
            min_fr_tentative_vol: "",
            min_fr_dommages_materiels: "",
            min_fr_catastrophes_naturelles: "",
            min_fr_catastrophes_technologiques: "",
            pdf_notice: "",
            pdf_ipid: ""
        });
        setSelectedInsuranceId(null);
        setError('');
        setSuccess('');
    };

    const handleEditInsurance = async (insuranceId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/insurances/${insuranceId}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération des détails de l'assurance.");
    
            const data = await response.json();
            if (!data || !data.insurance) throw new Error("Données d'assurance invalides.");
    
            setFormData({
                engagement: data.insurance.engagement || "",
                name: data.insurance.name || "",
                price: data.insurance.price || "",
                insurer_id: data.insurance.insurer?.id || "",
                category_id: data.insurance.category?.id || "",
                description: data.insurance.description || "",
                sector_id: data.insurance.sector?.id || "",
                status_id: data.insurance.status?.id || "",
                price_bike_minimum: data.insurance.price_bike_minimum || "",
                vol: data.insurance.vol || false,
                tentative_vol: data.insurance.tentative_vol || false,
                dommages_materiels: data.insurance.dommages_materiels || false,
                catastrophes_naturelles: data.insurance.catastrophes_naturelles || false,
                catastrophes_technologiques: data.insurance.catastrophes_technologiques || false,
                vol_franchise: data.insurance.vol_franchise || "",
                tentative_vol_franchise: data.insurance.tentative_vol_franchise || "",
                dommages_materiels_franchise: data.insurance.dommages_materiels_franchise || "",
                catastrophes_naturelles_franchise: data.insurance.catastrophes_naturelles_franchise || "",
                catastrophes_technologiques_franchise: data.insurance.catastrophes_technologiques_franchise || "",
                min_fr_vol: data.insurance.min_fr_vol || "",
                min_fr_tentative_vol: data.insurance.min_fr_tentative_vol || "",
                min_fr_dommages_materiels: data.insurance.min_fr_dommages_materiels || "",
                min_fr_catastrophes_naturelles: data.insurance.min_fr_catastrophes_naturelles || "",
                min_fr_catastrophes_technologiques: data.insurance.min_fr_catastrophes_technologiques || "",
                pdf_notice: "",
                pdf_ipid: ""
            });
    
            setSelectedInsuranceId(insuranceId);
        } catch (error) {
            setError(error.message);
        }
    };
    

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Assurances
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* Liste des assurances placée à droite */}

                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6">{selectedInsuranceId ? "Modifier une Assurance" : "Ajouter une Assurance"}</Typography>
                            {selectedInsuranceId && (
                                <IconButton onClick={resetForm} color="primary">
                                    <Backspace />
                                </IconButton>
                            )}
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Engagement (mois)" fullWidth type="number" name="engagement" value={formData.engagement} onChange={handleChange} />
                        <TextField label="Nom de l'assurance" fullWidth name="name" value={formData.name} onChange={handleChange} />
                        <TextField label="Prix (€)" fullWidth type="number" name="price" value={formData.price} onChange={handleChange} />

                        <FormControl fullWidth>
                            <InputLabel>Assureur</InputLabel>
                            <Select name="insurer_id" value={formData.insurer_id} onChange={handleChange}>
                                {insurers.map(insurer => <MenuItem key={insurer.id} value={insurer.id}>{insurer.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Catégorie</InputLabel>
                            <Select name="category_id" value={formData.category_id} onChange={handleChange}>
                                {categories.map(category => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <TextField label="Description" fullWidth multiline rows={4} name="description" value={formData.description} onChange={handleChange} />

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

                        <TextField label="Prix minimum du vélo (€)" fullWidth type="number" name="price_bike_minimum" value={formData.price_bike_minimum} onChange={handleChange} />

                        {/* Cases à cocher pour les garanties */}
                        <FormControlLabel control={<Checkbox name="vol" checked={formData.vol} onChange={handleChange} />} label="Vol couvert" />
                        <FormControlLabel control={<Checkbox name="tentative_vol" checked={formData.tentative_vol} onChange={handleChange} />} label="Tentative de vol" />
                        <FormControlLabel control={<Checkbox name="dommages_materiels" checked={formData.dommages_materiels} onChange={handleChange} />} label="Dommages matériels" />
                        <FormControlLabel control={<Checkbox name="catastrophes_naturelles" checked={formData.catastrophes_naturelles} onChange={handleChange} />} label="Catastrophes naturelles" />
                        <FormControlLabel control={<Checkbox name="catastrophes_technologiques" checked={formData.catastrophes_technologiques} onChange={handleChange} />} label="Catastrophes technologiques" />

                        {/* Champs pour les franchises */}
                        <TextField label="Franchise vol (€)" fullWidth type="number" name="vol_franchise" value={formData.vol_franchise} onChange={handleChange} />
                        <TextField label="Franchise tentative de vol (€)" fullWidth type="number" name="tentative_vol_franchise" value={formData.tentative_vol_franchise} onChange={handleChange} />
                        <TextField label="Franchise dommages matériels (€)" fullWidth type="number" name="dommages_materiels_franchise" value={formData.dommages_materiels_franchise} onChange={handleChange} />
                        <TextField label="Franchise catastrophes naturelles (€)" fullWidth type="number" name="catastrophes_naturelles_franchise" value={formData.catastrophes_naturelles_franchise} onChange={handleChange} />
                        <TextField label="Franchise catastrophes technologiques (€)" fullWidth type="number" name="catastrophes_technologiques_franchise" value={formData.catastrophes_technologiques_franchise} onChange={handleChange} />

                        {/* Champs pour les franchises minimales */}
                        <TextField label="Min franchise vol (€)" fullWidth type="number" name="min_fr_vol" value={formData.min_fr_vol} onChange={handleChange} />
                        <TextField label="Min franchise tentative de vol (€)" fullWidth type="number" name="min_fr_tentative_vol" value={formData.min_fr_tentative_vol} onChange={handleChange} />
                        <TextField label="Min franchise dommages matériels (€)" fullWidth type="number" name="min_fr_dommages_materiels" value={formData.min_fr_dommages_materiels} onChange={handleChange} />
                        <TextField label="Min franchise catastrophes naturelles (€)" fullWidth type="number" name="min_fr_catastrophes_naturelles" value={formData.min_fr_catastrophes_naturelles} onChange={handleChange} />
                        <TextField label="Min franchise catastrophes technologiques (€)" fullWidth type="number" name="min_fr_catastrophes_technologiques" value={formData.min_fr_catastrophes_technologiques} onChange={handleChange} />

                        {/* Upload des fichiers PDF */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Fichiers PDF</Typography>
                            <TextField
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setFormData({ ...formData, pdf_notice: e.target.files[0] })}
                                fullWidth
                                variant="outlined"
                                label="Ajouter Notice PDF"
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setFormData({ ...formData, pdf_ipid: e.target.files[0] })}
                                fullWidth
                                variant="outlined"
                                label="Ajouter IPID PDF"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>


                            <Button type="submit" variant="contained" color="primary">
                                {loading ? <CircularProgress size={24} color="inherit" /> : selectedInsuranceId ? "Modifier" : "Ajouter"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">Liste des Assurances</Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Barre de recherche */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Rechercher par nom ou prix..."
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
                            {insurances
                                .filter(insurance =>
                                    insurance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (insurance.price && insurance.price.toString().includes(searchTerm))
                                )
                                .map(insurance => (
                                    <ListItem 
                                        key={insurance.id} 
                                        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    >
                                        <ListItemText 
                                            primary={insurance.name} 
                                            secondary={`Prix: ${insurance.price}€ | Engagement: ${insurance.engagement} mois`}
                                        />
                                        <IconButton onClick={() => handleEditInsurance(insurance.id)} color="primary">
                                            <Edit />
                                        </IconButton>
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

export default AddInsurancePage;
