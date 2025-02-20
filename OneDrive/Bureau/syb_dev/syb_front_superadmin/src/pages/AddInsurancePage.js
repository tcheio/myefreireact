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
    const [advantages, setAdvantages] = useState([
        { id: uuidv4(), title: "", description: "" }
    ]);
    
    const [newAdvantage, setNewAdvantage] = useState({ title: "", description: "" });
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
    const handleChangeAdvantage = (index, field, value) => {
        setAdvantages(prevAdvantages =>
            prevAdvantages.map((adv, i) =>
                i === index ? { ...adv, [field]: value } : adv
            )
        );
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
    
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== "" && formData[key] !== null && key !== "pdf_notice" && key !== "pdf_ipid") {
                    formDataToSend.append(key, formData[key]);
                }
            });
    
            if (formData.pdf_notice) {
                formDataToSend.append("pdf_notice", formData.pdf_notice);
            }
            if (formData.pdf_ipid) {
                formDataToSend.append("pdf_ipid", formData.pdf_ipid);
            }
    
            formDataToSend.append("advantages", JSON.stringify(advantages.length ? advantages : []));
    
            const response = await fetch(
                selectedInsuranceId
                    ? `http://localhost:3000/api/insurances/${selectedInsuranceId}`
                    : 'http://localhost:3000/api/insurances',
                {
                    method: selectedInsuranceId ? 'PUT' : 'POST',
                    body: formDataToSend
                }
            );
    
            if (!response.ok) {
                throw new Error("Erreur lors de l'enregistrement");
            }
    
            setSuccess(selectedInsuranceId ? "Assurance mise à jour !" : "Assurance ajoutée !");
            resetForm();
            fetchInsurances();
            
            // 🛑 Scroller en haut de la page après l'ajout
            window.scrollTo({ top: 0, behavior: "smooth" });
    
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleAddAdvantage = () => {
        setAdvantages([...advantages, { id: uuidv4(), title: "", description: "" }]);
    };
    

    const handleRemoveAdvantage = (id) => {
        setAdvantages(prevAdvantages => prevAdvantages.filter(adv => adv.id !== id));
    };
    
    
    
    const fetchCategoriesBySector = async (sectorId) => {
        if (!sectorId) {
            setCategories([]);
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/api/categories/${sectorId}`);
            if (!response.ok) throw new Error("Impossible de récupérer les catégories.");
    
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            setError(error.message);
            setCategories([]);
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
    
            const convertBase64ToBlobUrl = (base64String) => {
                if (!base64String) return null;
    
                const byteCharacters = atob(base64String);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });
                return URL.createObjectURL(blob);
            };
    
            setFormData({
                engagement: data.insurance.engagement || "",
                name: data.insurance.name || "",
                price: data.insurance.price || "",
                insurer_id: data.insurance.Insurer?.id || "",
                category_id: data.insurance.Category?.id || "",
                description: data.insurance.description || "",
                sector_id: data.insurance.Sector?.id || "",
                status_id: data.insurance.Status?.id || "",
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
                pdf_notice: convertBase64ToBlobUrl(data.insurance.pdf_notice),
                pdf_ipid: convertBase64ToBlobUrl(data.insurance.pdf_ipid)
            });
    
            setSelectedInsuranceId(insuranceId);
            fetchAdvantages(insuranceId);
        } catch (error) {
            setError(error.message);
        }
    };
    
    
    

    const fetchAdvantages = async (insuranceId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/insurances/${insuranceId}/advantages`);
            if (!response.ok) throw new Error("Erreur lors de la récupération des avantages.");
    
            const data = await response.json();
            setAdvantages(data.advantages || []);
        } catch (error) {
            setAdvantages([]);
        }
    };

    const fetchSectorByInsurer = async (insurerId) => {
        if (!insurerId) {
            setFormData((prevData) => ({ ...prevData, sector_id: "", category_id: "" }));
            setSectors([]);
            setCategories([]);
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/api/sectors/${insurerId}`);
            if (!response.ok) throw new Error("Impossible de récupérer le secteur de cet assureur.");
    
            const data = await response.json();
    
            if (data.sectors.length > 0) {
                const sectorId = data.sectors[0].id; // Supposons qu'un assureur a un seul secteur
                setFormData((prevData) => ({ ...prevData, sector_id: sectorId, category_id: "" }));
                fetchCategoriesBySector(sectorId); // Charge les catégories en fonction du secteur présélectionné
            } else {
                setFormData((prevData) => ({ ...prevData, sector_id: "", category_id: "" }));
                setCategories([]);
            }
        } catch (error) {
            setError(error.message);
            setSectors([]);
            setCategories([]);
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
                        <TextField label="Nom de l'assurance" fullWidth name="name" value={formData.name} onChange={handleChange} />
                        <FormControl fullWidth>
                            <InputLabel>Assureur</InputLabel>
                            <Select
                                name="insurer_id"
                                value={formData.insurer_id}
                                onChange={(e) => {
                                    handleChange(e); 
                                    fetchSectorByInsurer(e.target.value); 
                                }}
                            >
                                {insurers.map(insurer => (
                                    <MenuItem key={insurer.id} value={insurer.id}>{insurer.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Secteur"
                            fullWidth
                            value={sectors.find(s => s.id === formData.sector_id)?.name || "Aucun"}
                            InputProps={{ readOnly: true }}
                        />        
                         <FormControl fullWidth>
                            <InputLabel>Catégorie</InputLabel>
                            <Select name="category_id" value={formData.category_id} onChange={handleChange}>
                                {categories.map(category => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
                            </Select>
                        </FormControl>    
                        <TextField label="Prix de l'assurance (PLN)" fullWidth type="number" name="price" value={formData.price} onChange={handleChange} />
                        <TextField label="Description" fullWidth multiline rows={4} name="description" value={formData.description} onChange={handleChange} />
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select name="status_id" value={formData.status_id} onChange={handleChange}>
                                {statuses.map(status => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="Engagement (mois)" fullWidth type="number" name="engagement" value={formData.engagement} onChange={handleChange} />
                        <TextField label="Prix minimum du vélo (PLN)" fullWidth type="number" name="price_bike_minimum" value={formData.price_bike_minimum} onChange={handleChange} />
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
                        {/* Section Avantages */}
                        <Divider sx={{ mt: 3, mb: 2 }} />
                        <Typography variant="h6">Avantages</Typography>

                        {advantages.map((advantage, index) => (
                            <Box key={advantage.id} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Titre de l'avantage"
                                            fullWidth
                                            value={advantage.title}
                                            onChange={(e) => handleChangeAdvantage(index, "title", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Description"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={advantage.description}
                                            onChange={(e) => handleChangeAdvantage(index, "description", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <IconButton onClick={() => handleRemoveAdvantage(advantage.id)} sx={{ mt: 1, float: 'right' }}>
                                    <Delete color="error" />
                                </IconButton>
                            </Box>
                        ))}

                        <Button
                            startIcon={<Add />}
                            onClick={handleAddAdvantage}
                            sx={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                                "&:hover": {
                                    backgroundColor: "black",
                                    color: "white",
                                },
                            }}
                        >
                            Ajouter un avantage
                        </Button>

                        {/* Affichage des fichiers PDF en mode modification */}
                        {/* Affichage des fichiers PDF en mode édition */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1">Fichiers PDF existants :</Typography>

                            {formData.pdf_notice && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                                    <Typography variant="body2">Notice actuelle :</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => window.open(formData.pdf_notice, "_blank")}
                                    >
                                        Voir Notice PDF
                                    </Button>
                                </Box>
                            )}

                            {formData.pdf_ipid && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                                    <Typography variant="body2">IPID actuel :</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => window.open(formData.pdf_ipid, "_blank")}
                                    >
                                        Voir IPID PDF
                                    </Button>
                                </Box>
                            )}
                        </Box>


                        {/* Upload des fichiers PDF */}
                        {/* Upload des fichiers PDF avec un meilleur espacement */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1">Télécharger un nouveau fichier PDF :</Typography>
                            
                            {/* Notice PDF Upload */}
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{
                                        bgcolor: "#1976d2",
                                        color: "white",
                                        "&:hover": { bgcolor: "#1565c0" },
                                    }}
                                >
                                    Choisir Notice PDF
                                    <input
                                        type="file"
                                        hidden
                                        accept="application/pdf"
                                        onChange={(e) => setFormData({ ...formData, pdf_notice: e.target.files[0] })}
                                    />
                                </Button>
                                {formData.pdf_notice && typeof formData.pdf_notice !== "string" && (
                                    <Typography variant="body2" sx={{ mt: 1, color: "green" }}>
                                        {formData.pdf_notice.name}
                                    </Typography>
                                )}
                            </Box>

                            {/* IPID PDF Upload */}
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{
                                        bgcolor: "#1976d2",
                                        color: "white",
                                        "&:hover": { bgcolor: "#1565c0" },
                                    }}
                                >
                                    Choisir IPID PDF
                                    <input
                                        type="file"
                                        hidden
                                        accept="application/pdf"
                                        onChange={(e) => setFormData({ ...formData, pdf_ipid: e.target.files[0] })}
                                    />
                                </Button>
                                {formData.pdf_ipid && typeof formData.pdf_ipid !== "string" && (
                                    <Typography variant="body2" sx={{ mt: 1, color: "green" }}>
                                        {formData.pdf_ipid.name}
                                    </Typography>
                                )}
                            </Box>
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
