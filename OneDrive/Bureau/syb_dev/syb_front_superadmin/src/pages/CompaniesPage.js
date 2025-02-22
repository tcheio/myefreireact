import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse } from "@mui/material";


const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [applyToAllSites, setApplyToAllSites] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [insurances, setInsurances] = useState([]);
  const [filteredInsurances, setFilteredInsurances] = useState([]);
  const [insuranceSearch, setInsuranceSearch] = useState("");
  const [siteInsurances, setSiteInsurances] = useState({});
  const [expandedSite, setExpandedSite] = useState(null);
  const [filteredCompanies, setFilteredCompanies] = useState([]);


  useEffect(() => {
    fetchCompanies();
    fetchInsurances();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/companies");
      const data = await response.json();
      setCompanies(data.companies || []);
      setFilteredCompanies(data.companies || []); // 🔹 Initialiser les entreprises filtrées
    } catch (error) {
      console.error("Erreur lors du chargement des entreprises", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchInsurances = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/insurances");
      const data = await response.json();
      setInsurances(data.insurances || []);
      setFilteredInsurances(data.insurances || []);
    } catch (error) {
      console.error("Erreur lors du chargement des assurances", error);
    }
  };

  const fetchSiteInsurances = async (siteId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/insurances/site/${siteId}`);
      const data = await response.json();
      setSiteInsurances((prev) => ({ ...prev, [siteId]: data.insurances || [] }));
    } catch (error) {
      console.error("Erreur lors du chargement des assurances du site", error);
    }
  };
  
  
  const handleSearchCompany = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(query) || 
      company.siret.toLowerCase().includes(query) // 🔹 Recherche aussi par SIRET
    );
  
    setFilteredCompanies(filtered);
  
    // 🔹 Si une entreprise est sélectionnée, on recharge ses sites et assurances
    if (selectedCompany && !filtered.find(c => c.id === selectedCompany)) {
      setSelectedCompany(null);
      setExpandedSite(null);
    }
  };
  

  const handleViewCompany = (companyId) => {
    setSelectedCompany(companyId);
  
    // Trouver l'entreprise sélectionnée
    const company = companies.find(c => c.id === companyId);
    if (!company || !company.Sites) return;
  
    // Charger les assurances pour chaque site de l'entreprise
    company.Sites.forEach(site => {
      fetchSiteInsurances(site.id);
    });
  };
  
  const handleOpenDialog = (siteId, allSites = false) => {
    setSelectedSite(siteId);
    setApplyToAllSites(allSites);
    if (!allSites) fetchSiteInsurances(siteId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSite(null);
    setApplyToAllSites(false);
  };

  const handleSearchInsurance = (event) => {
    const query = event.target.value.toLowerCase();
    setInsuranceSearch(query);
    
    setFilteredInsurances(
      insurances.filter(ins => 
        ins.name.toLowerCase().includes(query) || 
        ins.product_code.toLowerCase().includes(query)
      )
    );
  };
  

  const handleToggleInsurance = async (siteId, insuranceId) => {
    if (!siteId || !insuranceId) return;
    const isAssigned = siteInsurances[siteId]?.some((ins) => ins.id === insuranceId);
    const url = isAssigned
      ? "http://localhost:3000/api/insurances/unassign"
      : "http://localhost:3000/api/insurances/assign";
    const payload = { site_ids: [siteId], insurance_ids: [insuranceId] };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de la requête");

      fetchSiteInsurances(siteId);
    } catch (error) {
      console.error("Erreur lors de l'assignation", error);
    }
  };

  // 🔥 Fonction pour assigner une assurance à tous les sites d'une entreprise
  const handleToggleInsuranceForAllSites = async (insuranceId) => {
    if (!selectedCompany) return;
    const company = companies.find(c => c.id === selectedCompany);
    if (!company || !company.Sites.length) return;

    const siteIds = company.Sites.map(site => site.id);
    const payload = { site_ids: siteIds, insurance_ids: [insuranceId] };

    try {
      const response = await fetch("http://localhost:3000/api/insurances/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de la requête");

      siteIds.forEach(fetchSiteInsurances);
    } catch (error) {
      console.error("Erreur lors de l'assignation à tous les sites", error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>Gestion des Entreprises</Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Rechercher une entreprise par nom ou SIRET..."
        value={searchTerm}
        onChange={handleSearchCompany} // 🔹 On appelle la fonction de recherche
        InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        sx={{ mb: 3 }}
        />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
            {filteredCompanies.map((company) => (
            <Grid item xs={12} key={company.id}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="h6">{company.name}</Typography>
                      <Typography variant="body2">SIRET: {company.siret}</Typography>
                      <Typography variant="body2">Nombre de sites: {company.Sites.length}</Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", gap: 1 }}>  
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={() => handleViewCompany(company.id)}
                        >
                            Détail
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewCompany(company.id)}
                            endIcon={<ExpandMore />} // 🔹 Flèche vers le bas
                        >
                            Assurance
                        </Button>
                    </Box>
                  </Box>
                  {selectedCompany === company.id && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="info"
                        sx={{ mb: 2 }}
                        onClick={() => handleOpenDialog(null, true)}
                      >
                        Assigner une assurance à tous les sites
                      </Button>
                      <List>
                        {company.Sites.map((site) => (
                            <Paper key={site.id} sx={{ p: 2, mt: 1 }}>
                            {/* 🔥 Ajout du bouton de toggle */}
                            <ListItem
                                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                >
                                <ListItemText primary={site.name} />

                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button variant="outlined">
                                    Détails
                                    </Button>
                                    <Button
                                    variant="outlined"
                                    color="info"
                                    onClick={() => setExpandedSite(expandedSite === site.id ? null : site.id)}
                                    endIcon={expandedSite === site.id ? <ExpandLess /> : <ExpandMore />}
                                    >
                                    Assigner
                                    </Button>
                                    <Button variant="contained" onClick={() => handleOpenDialog(site.id)}>
                                    Ajouter Assurance
                                    </Button>
                                </Box>
                                </ListItem>

                            {/* 🔥 Ajout du Collapse pour afficher les assurances assignées */}
                            <Collapse in={expandedSite === site.id}>
                            <List>
                                {siteInsurances[site.id] === undefined ? (
                                    <Typography sx={{ p: 2, color: "gray" }}>Chargement des assurances...</Typography>
                                ) : siteInsurances[site.id].length > 0 ? (
                                    siteInsurances[site.id].map((insurance) => (
                                    <ListItem key={insurance.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <ListItemText primary={`${insurance.name} (${insurance.product_code})`} />
                                        <Button variant="outlined" size="small">Détail</Button>
                                    </ListItem>
                                    ))
                                ) : (
                                    <Typography sx={{ p: 2, color: "gray" }}>Aucune assurance assignée</Typography>
                                )}
                            </List>
                            </Collapse>
                            </Paper>
                        ))}
                        </List>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assigner une Assurance</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Rechercher une assurance..."
            variant="outlined"
            value={insuranceSearch}
            onChange={handleSearchInsurance}
            sx={{ mb: 2 }}
          />
        {filteredInsurances.map((insurance) => {
        const isAssigned = siteInsurances[selectedSite]?.some((ins) => ins.id === insurance.id);

        return (
            <Box
            key={insurance.id}
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
            >
            <Box>
                <Typography>{insurance.name}</Typography>
                <Typography variant="body2" color="gray">Code produit: {insurance.product_code}</Typography>
            </Box>

            {/* 🔹 Nouveau bouton Détail */}
            <Button variant="outlined" size="small">
                Détail
            </Button>

            <Switch
                checked={isAssigned}
                onChange={() =>
                applyToAllSites
                    ? handleToggleInsuranceForAllSites(insurance.id)
                    : handleToggleInsurance(selectedSite, insurance.id)
                }
            />
            </Box>
        );
        })}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompaniesPage;
