import React, { useState, useEffect } from 'react';
import { 
    Container, TextField, Button, Typography, Box, Alert, Paper, Grid, CircularProgress, MenuItem, Select, FormControl, InputLabel, List, ListItem, ListItemText, Divider, IconButton, InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';

const AddUserPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('superadmin');
    const [companyId, setCompanyId] = useState('');
    const [siteIds, setSiteIds] = useState([]);
    const [managerId, setManagerId] = useState('');
    const [companies, setCompanies] = useState([]);
    const [sites, setSites] = useState([]);
    const [managers, setManagers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // État pour stocker l'utilisateur sélectionné pour l'édition
    const [selectedRole, setSelectedRole] = useState("");
    const [teamMembers, setTeamMembers] = useState([]); // Stocke les membres de l'équipe

    useEffect(() => {
        fetchCompanies();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (companyId) {
            fetchSitesByCompany(companyId);
        } else {
            setSites([]);
        }
    }, [companyId]);

    useEffect(() => {
        if (siteIds.length > 0) {
            fetchManagersBySite(siteIds[0]);
        } else {
            setManagers([]);
        }
    }, [siteIds]);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/companies');
            const data = await response.json();
            setCompanies(data.companies);
        } catch (error) {
            setError("Erreur lors du chargement des entreprises");
        }
    };

    const fetchSitesByCompany = async (companyId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/sites/company/${companyId}`);
            const data = await response.json();
            setSites(data.sites);
        } catch (error) {
            setError("Erreur lors du chargement des sites");
        }
    };

    const fetchManagersBySite = async (siteId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users?site_id=${siteId}&role=manager`);
            if (!response.ok) throw new Error("Erreur lors du chargement des managers");
            const data = await response.json();
    
            console.log("👤 Managers récupérés :", data.users); // Ajout d'un log
    
            setManagers(data.users.filter(user => user.role === 'manager'));
        } catch (error) {
            setError("Erreur lors du chargement des managers");
        }
    };
    
    

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            setError("Erreur lors du chargement des utilisateurs");
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        fetchUserById(user.id); // Charge les données détaillées de l'utilisateur sélectionné
    };

    const fetchUserById = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`);
            const data = await response.json();
    
            if (data.user) {
                setSelectedUser(data.user);
                setFirstName(data.user.first_name);
                setLastName(data.user.last_name);
                setEmail(data.user.email);
                setRole(data.user.role);
    
                console.log("🔍 Utilisateur récupéré :", data.user); // 🔎 DEBUG pour voir les données reçues
    
                // 🔹 Cas où l'utilisateur est un **VENDEUR**
                if (data.user.role === "vendor") {
                    const manager = data.user.Managers?.[0] || null;
                    setManagerId(manager?.id || '');
    
                    // ✅ Récupération des **sites** liés au manager
                    const managedSites = manager?.ManagedSites || [];
                    setSiteIds(managedSites.map(site => site.id));
    
                    console.log("📌 Sites du manager :", managedSites);
    
                    // ✅ Récupération de l'**entreprise** du premier site géré par le manager
                    const company = managedSites.length > 0 ? managedSites[0].Company : null;
                    setCompanyId(company?.id || '');
    
                    console.log("🏢 Entreprise récupérée :", company);
                }
    
                // 🔹 Cas où l'utilisateur est un **MANAGER**
                if (data.user.role === "manager") {
                    setSiteIds(data.user.ManagedSites?.map(site => site.id) || []);
    
                    console.log("📌 Sites gérés par le manager :", data.user.ManagedSites);
    
                    // ✅ Récupération de l'**entreprise** liée au premier site géré
                    const company = data.user.ManagedSites?.[0]?.Company || null;
                    setCompanyId(company?.id || '');
    
                    console.log("🏢 Entreprise du manager :", company);
    
                    // ✅ Récupération des membres de l'équipe (vendeurs gérés par ce manager)
                    setTeamMembers(data.user.ManagedVendors || []);
                    console.log("👥 Membres de l'équipe :", data.user.ManagedVendors);
                }
    
                // 🔹 Cas où l'utilisateur est un **ADMIN**
                if (data.user.role === "admin") {
                    setCompanyId(data.user.Companies?.[0]?.id || '');
                    console.log("🏢 Entreprise de l'admin :", data.user.Companies);
                }
            } else {
                setError("Utilisateur non trouvé");
            }
        } catch (error) {
            setError("Erreur lors de la récupération de l'utilisateur");
        }
    };
    
    
    

    useEffect(() => {
        if (selectedUser) {
            setFirstName(selectedUser.first_name);
            setLastName(selectedUser.last_name);
            setEmail(selectedUser.email);
            setRole(selectedUser.role);
            setCompanyId(selectedUser.Companies?.[0]?.id || '');
            setSiteIds(selectedUser.ManagedSites?.map(site => site.id) || []);
            setManagerId(selectedUser.Managers?.[0]?.id || '');
        }
    }, [selectedUser]);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
    
        const userData = { 
            first_name: firstName, 
            last_name: lastName, 
            email, 
            password, 
            role 
        };
    
        if (role !== 'superadmin') userData.company_id = companyId;
        if (role === 'manager' || role === 'vendor') userData.site_ids = siteIds;
        if (role === 'vendor') userData.manager_id = managerId;
    
        let url = 'http://localhost:3000/api/users';
        let method = 'POST';
    
        if (selectedUser) {
            url = `http://localhost:3000/api/users/${selectedUser.id}`;
            method = 'PUT';
        }
    
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error("Erreur lors de la création ou de la mise à jour de l'utilisateur");
    
            const message = selectedUser ? "Utilisateur mis à jour avec succès" : "Utilisateur ajouté avec succès";
            setSuccess(message);
    
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setCompanyId('');
            setSiteIds([]);
            setManagerId('');
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (selectedUser) {
            console.log("🔄 Mise à jour des champs avec l'utilisateur sélectionné", selectedUser);
    
            setFirstName(selectedUser.first_name);
            setLastName(selectedUser.last_name);
            setEmail(selectedUser.email);
            setRole(selectedUser.role);
    
            if (selectedUser.role === "vendor") {
                const manager = selectedUser.Managers?.[0] || null;
                setManagerId(manager?.id || '');
    
                const managedSites = manager?.ManagedSites || [];
                setSiteIds(managedSites.map(site => site.id));
    
                console.log("📌 Sites mis à jour :", managedSites);
    
                const company = managedSites.length > 0 ? managedSites[0].Company : null;
                setCompanyId(company?.id || '');
    
                console.log("🏢 Entreprise mise à jour :", company);
            }
    
            if (selectedUser.role === "manager") {
                setSiteIds(selectedUser.ManagedSites?.map(site => site.id) || []);
                console.log("📌 Sites gérés mis à jour :", selectedUser.ManagedSites);
    
                const company = selectedUser.ManagedSites?.[0]?.Company || null;
                setCompanyId(company?.id || '');
    
                console.log("🏢 Entreprise du manager mise à jour :", company);
            }
    
            if (selectedUser.role === "admin") {
                setCompanyId(selectedUser.Companies?.[0]?.id || '');
                console.log("🏢 Entreprise de l'admin mise à jour :", selectedUser.Companies);
            }
        }
    }, [selectedUser]);
    
    

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>{selectedUser ? 'Modifier' : 'Créer'} un Utilisateur</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Formulaire Utilisateur</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Prénom" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            <TextField label="Nom" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <TextField label="Mot de passe" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <FormControl fullWidth>
                                <InputLabel>Rôle</InputLabel>
                                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <MenuItem value="superadmin">Super Admin</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="manager">Manager</MenuItem>
                                    <MenuItem value="vendor">Vendeur</MenuItem>
                                </Select>
                            </FormControl>
                            {role !== "superadmin" && (
                                <FormControl fullWidth>
                                    <InputLabel>Entreprise</InputLabel>
                                    <Select 
                                        value={companyId || ''} 
                                        onChange={(e) => setCompanyId(e.target.value)}
                                    >
                                        {companies.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            {(role === "manager" || role === "vendor") && (
                                <FormControl fullWidth>
                                    <InputLabel>Sites</InputLabel>
                                    <Select 
                                        multiple 
                                        value={siteIds.length > 0 ? siteIds : []} 
                                        onChange={(e) => setSiteIds(e.target.value)}
                                    >
                                        {sites.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            {role === "vendor" && (
                                <FormControl fullWidth>
                                    <InputLabel>Manager</InputLabel>
                                    <Select
                                        value={managers.some(m => m.id === managerId) ? managerId : ''}
                                        onChange={(e) => setManagerId(e.target.value)}
                                    >
                                        {managers.map(m => (
                                            <MenuItem key={m.id} value={m.id}>{m.email}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            {selectedUser && role === "manager" && teamMembers.length > 0 && (
                                <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
                                    <Typography variant="h6">Équipe du Manager</Typography>
                                    <List>
                                        {teamMembers.map((member) => (
                                            <ListItem key={member.id} divider>
                                                <ListItemText
                                                    primary={`${member.last_name} ${member.first_name}`}
                                                />
                                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditUser(member)}>
                                                    <Edit />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                            <Button type="submit" variant="contained" color="primary">
                                {loading ? <CircularProgress size={24} color="inherit" /> : selectedUser ? "Modifier" : "Ajouter"}
                            </Button>
                            {selectedUser && (
                                <Button variant="outlined" color="primary" onClick={() => setSelectedUser(null)}>
                                    Annuler l'édition
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">Liste des Utilisateurs</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch', mb: 2 }}>
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>Filtrer par rôle</InputLabel>
                                <Select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">Tous</MenuItem>
                                    <MenuItem value="superadmin">Super Admin</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="manager">Manager</MenuItem>
                                    <MenuItem value="vendor">Vendeur</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Rechercher par nom..."
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
                        </Box>
                        <List>
                        {users
                            .filter(user =>
                                (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                                (selectedRole === "" || user.role === selectedRole)
                            )
                            .map(user => (
                                <ListItem key={user.id}>
                                    <ListItemText 
                                        primary={`${user.last_name} ${user.first_name}`} 
                                        secondary={`Rôle: ${user.role}`} 
                                    />
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditUser(user)}>
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

export default AddUserPage;
