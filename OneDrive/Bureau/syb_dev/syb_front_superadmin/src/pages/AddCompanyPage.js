import React, { useState, useEffect } from 'react';
import { 
    Container, TextField, Button, Typography, Box, Alert, List, ListItem, ListItemText, Paper, 
    Grid, Divider, CircularProgress, MenuItem, Select, FormControl, InputLabel, IconButton, InputAdornment
} from '@mui/material';

import { Edit, Add, Delete, Backspace } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { Search } from "@mui/icons-material"; // Ajoute cette ligne en haut de ton fichier

const AddCompanyPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [companies, setCompanies] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [name, setName] = useState('');
    const [siret, setSiret] = useState('');
    const [sectorId, setSectorId] = useState('');
    const [statusId, setStatusId] = useState('');
    const [admins, setAdmins] = useState([{ id: uuidv4(), first_name: '', last_name: '', email: '', password: '' }]);
    const [sites, setSites] = useState([{ id: uuidv4(), name: '', status_id: '', address: { type_voie: '', voie: '', nr_voie: '', code_postal: '', ville: '', pays: '' } }]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchCompanies(), fetchSectors(), fetchStatuses()]);
        };
        fetchData();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/companies');
            if (!response.ok) throw new Error("Impossible de récupérer les entreprises.");
            const data = await response.json();
            setCompanies(data.companies);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        if (!name.trim() || !siret || !sectorId || !statusId || admins.length === 0) {
            return setError("Tous les champs sont requis, et au moins un admin doit être ajouté.");
        }
    
        setLoading(true);
        try {
            const response = await fetch(selectedCompanyId ? 
                `http://localhost:3000/api/companies/${selectedCompanyId}` : 
                'http://localhost:3000/api/companies', {
                method: selectedCompanyId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    siret: String(siret),
                    sector_id: String(sectorId),
                    status_id: String(statusId),
                    admins: admins.map(admin => ({
                        id: admin.id || uuidv4(), // ✅ Conserver l'ID pour la mise à jour
                        first_name: admin.first_name,
                        last_name: admin.last_name,
                        email: admin.email,
                        password: admin.password // ⚠️ Ne pas envoyer de mot de passe vide
                    })),
                    sites: sites.map(site => ({
                        id: site.id || uuidv4(), // ✅ Conserver l'ID pour la mise à jour
                        name: site.name,
                        status_id: site.status_id,
                        address: {
                            type_voie: site.address.type_voie,
                            voie: site.address.voie,
                            nr_voie: site.address.nr_voie,
                            nr_locale: site.address.nr_locale,
                            code_postal: site.address.code_postal,
                            ville: site.address.ville,
                            pays: site.address.pays
                        }
                    }))
                })
                
            });
    
            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }
    
            setSuccess(selectedCompanyId ? "Entreprise mise à jour !" : "Entreprise ajoutée !");
            resetForm(); // ✅ Réinitialisation du formulaire après ajout
            fetchCompanies(); // ✅ Recharge la liste des entreprises
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleEditCompany = async (companyId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/companies/${companyId}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération des détails de l'entreprise.");
            
            const company = await response.json();
    
            // ✅ Remplir le formulaire avec les données de l'entreprise
            setName(company.name);
            setSiret(company.siret);
            setSectorId(company.sector_id);
            setStatusId(company.status_id);
            const updatedAdmins = (company.Users || []).map(user => ({
                id: user.id,  // ✅ Ajout de l'ID pour mise à jour
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: '' // ⚠️ On ne récupère pas le mot de passe pour des raisons de sécurité
            }));
            
            setAdmins(updatedAdmins.length > 0 ? updatedAdmins : [{ id: uuidv4(), first_name: '', last_name: '', email: '', password: '' }]);
    
            // ✅ Vérifier que chaque site inclut une adresse complète
            const updatedSites = (company.Sites || []).map(site => ({
                id: site.id,  // ✅ Ajout de l'ID pour mise à jour
                name: site.name,
                status_id: site.status_id,
                address: site.SiteAddress ? { 
                    type_voie: site.SiteAddress.type_voie || '',
                    voie: site.SiteAddress.voie || '',
                    nr_voie: site.SiteAddress.nr_voie || '',
                    nr_locale: site.SiteAddress.nr_locale || '',
                    code_postal: site.SiteAddress.code_postal || '',
                    ville: site.SiteAddress.ville || '',
                    pays: site.SiteAddress.pays || ''
                } : { 
                    type_voie: '', voie: '', nr_voie: '', nr_locale: '', code_postal: '', ville: '', pays: ''
                }
            }));
    
            setSites(updatedSites);
            setSelectedCompanyId(companyId);
        } catch (error) {
            setError(error.message);
        }
    };
    
    
    


    const handleChange = (setState, index, field, value) => {
        setState(prevState => prevState.map((item, i) => {
            if (i !== index) return item;
    
            if (field.startsWith("address.")) {
                const fieldName = field.split(".")[1]; // Récupère le nom du champ après "address."
                return {
                    ...item,
                    address: {
                        ...item.address,
                        [fieldName]: value
                    }
                };
            } else {
                return { ...item, [field]: value };
            }
        }));
    };
    
    
    
    const handleRemove = (setState, id) => {
        setState(prevState => prevState.filter(item => item.id !== id));
    };    
    const handleAdd = (setState, newItem) => {
        setState(prevState => [
            ...prevState, 
            { 
                id: uuidv4(), 
                ...newItem, 
                address: { 
                    type_voie: '', 
                    voie: '', 
                    nr_voie: '', 
                    nr_locale: '',  // ✅ Ajout du champ manquant
                    code_postal: '', 
                    ville: '', 
                    pays: '' 
                } 
            }
        ]);
    };
    
    const resetForm = () => {
        setName('');
        setSiret('');
        setSectorId('');
        setStatusId('');
        setAdmins([{ id: uuidv4(), first_name: '', last_name: '', email: '', password: '' }]);
        setSites([{ id: uuidv4(), name: '', status_id: '', address: { type_voie: '', voie: '', nr_voie: '', nr_locale: '', code_postal: '', ville: '', pays: '' } }]);
        setSelectedCompanyId(null);
        setError('');
        setSuccess('');
    };
    

    
    

    const handleAddAdmin = () => {
        setAdmins([...admins, { id: uuidv4(), first_name: '', last_name: '', email: '', password: '' }]);
    };

    const handleAdminChange = (index, field, value) => {
        setAdmins(prevAdmins => prevAdmins.map((admin, i) => 
            i === index ? { ...admin, [field]: value } : admin
        ));
    };

    const handleRemoveAdmin = (id) => {
        setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== id));
    };
    

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Entreprises
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* ✅ FORMULAIRE - 2/3 DE L'ÉCRAN */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h6">{selectedCompanyId ? "Modifier une Entreprise" : "Ajouter une Entreprise"}</Typography>
                        {selectedCompanyId && (
                            <IconButton onClick={resetForm} color="primary">
                                <Backspace />
                            </IconButton>
                        )}
                    </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Nom de l'entreprise" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                            <TextField label="SIRET" fullWidth value={siret} onChange={(e) => setSiret(e.target.value)} />
                            <FormControl fullWidth>
                                <InputLabel>Secteur</InputLabel>
                                <Select value={sectorId} onChange={(e) => setSectorId(e.target.value)}>
                                    {sectors.map((sector) => <MenuItem key={sector.id} value={sector.id}>{sector.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select value={statusId} onChange={(e) => setStatusId(e.target.value)}>
                                    {statuses.map((status) => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                             {/* ✅ SITES */}
                             <Typography variant="h6">Sites</Typography>
                            {sites.map((site, index) => (
                                <Box key={site.id} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}><TextField label="Nom du site" fullWidth value={site.name} onChange={e => handleChange(setSites, index, 'name', e.target.value)} /></Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Statut</InputLabel>
                                                <Select value={site.status_id} onChange={e => handleChange(setSites, index, 'status_id', e.target.value)}>
                                                    {statuses.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {["type_voie", "voie", "nr_voie", "nr_locale", "code_postal", "ville", "pays"].map(field => (
                                            <Grid key={field} item xs={6}>
                                                <TextField 
                                                    label={field.replace("_", " ").toUpperCase()} 
                                                    fullWidth 
                                                    value={site.address?.[field] || ''} 
                                                    onChange={(e) => handleChange(setSites, index, `address.${field}`, e.target.value)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <IconButton onClick={() => handleRemove(setSites, site.id)} sx={{ mt: 1, float: 'right' }}><Delete color="error" /></IconButton>
                                </Box>
                            ))}
                            <Button startIcon={<Add />} onClick={() => handleAdd(setSites, { name: '', status_id: '', address: { type_voie: '', voie: '', nr_voie: '', code_postal: '', ville: '', pays: '' } })}>Ajouter un site</Button>

                            <Typography variant="h6">Administrateurs</Typography>
                                {admins.map((admin, index) => (
                                    <Box key={admin.id} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField label="Prénom" fullWidth value={admin.first_name} onChange={(e) => handleAdminChange(index, 'first_name', e.target.value)} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField label="Nom" fullWidth value={admin.last_name} onChange={(e) => handleAdminChange(index, 'last_name', e.target.value)} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField label="Email" fullWidth value={admin.email} onChange={(e) => handleAdminChange(index, 'email', e.target.value)} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField label="Mot de passe" type="password" fullWidth value={admin.password} onChange={(e) => handleAdminChange(index, 'password', e.target.value)} />
                                            </Grid>
                                        </Grid>
                                        <IconButton onClick={() => handleRemoveAdmin(admin.id)}>
                                            <Delete color="error" />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button startIcon={<Add />} onClick={handleAddAdmin}>Ajouter un administrateur</Button>


                            <Button type="submit" variant="contained" color="primary">
                                {loading ? <CircularProgress size={24} color="inherit" /> : selectedCompanyId ? "Modifier" : "Ajouter"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* ✅ LISTE DES ENTREPRISES - 1/3 DE L'ÉCRAN */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">Entreprises</Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* ✅ Barre de recherche subtile */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Rechercher par nom ou SIRET..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* ✅ Liste des entreprises avec filtrage */}
                        <List>
                            {companies
                                .filter(company =>
                                    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    company.siret.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((company) => (
                                    <ListItem key={`company-${company.id}`}>
                                        <ListItemText
                                            primary={company.name}
                                            secondary={`SIRET: ${company.siret}`}
                                            primaryTypographyProps={{ fontWeight: "bold" }}
                                            secondaryTypographyProps={{ fontSize: "0.85rem", color: "text.secondary" }}
                                        />
                                        <IconButton onClick={() => handleEditCompany(company.id)}>
                                            <Edit />
                                        </IconButton>
                                    </ListItem>
                                ))
                            }
                        </List>

                        {/* ✅ Message si aucune entreprise trouvée */}
                        {companies.filter(company =>
                            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            company.siret.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
                                Aucune entreprise trouvée.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AddCompanyPage;

