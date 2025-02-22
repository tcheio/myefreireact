import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Paper, List, 
    ListItem, ListItemText, Collapse
} from "@mui/material";
import { Business, LocationOn, People, ExpandLess, ExpandMore } from "@mui/icons-material";

const CompanyPopup = ({ open, onClose, company }) => {
    const [expandedSite, setExpandedSite] = useState(null);
    const [expandedManager, setExpandedManager] = useState(null);

    if (!company) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Détails de l'Entreprise</DialogTitle>
            <DialogContent>
                <Box>
                    {/* ✅ Informations de l'entreprise */}
                    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>{company.name}</Typography>
                        <Typography> SIRET: {company.siret}</Typography>
                        <Typography> Secteur: {company.Sector?.name || "Non renseigné"}</Typography>
                        <Typography>Statut: {company.Status?.name || "Non renseigné"}</Typography>
                    </Paper>

                    {/* ✅ Liste des sites */}
                    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} /> Sites
                        </Typography>
                        {(company.Sites || []).length > 0 ? (
                            <List>
                                {company.Sites.map((site) => (
                                    <Paper key={site.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                                        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <ListItemText 
                                                primary={site.name} 
                                                secondary={`Adresse: ${site.SiteAddress ? `${site.SiteAddress.nr_voie} ${site.SiteAddress.type_voie} ${site.SiteAddress.voie}, ${site.SiteAddress.ville}, ${site.SiteAddress.pays} (${site.SiteAddress.code_postal})` : "Non renseignée"}`} 
                                            />
                                            <Button
                                                variant="outlined"
                                                onClick={() => setExpandedSite(expandedSite === site.id ? null : site.id)}
                                                endIcon={expandedSite === site.id ? <ExpandLess /> : <ExpandMore />}
                                            >
                                                Voir effectifs
                                            </Button>
                                        </ListItem>

                                        {/* ✅ Managers et Vendeurs */}
                                        <Collapse in={expandedSite === site.id}>
                                            <List sx={{ pl: 4 }}>
                                                <Typography variant="subtitle1">Managers</Typography>
                                                {(site.Managers || []).length > 0 ? (
                                                    site.Managers.map((manager) => (
                                                        <Paper key={manager.id} sx={{ p: 2, mt: 1 }}>
                                                            <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                                                                <ListItemText 
                                                                    primary={`${manager.first_name} ${manager.last_name}`} 
                                                                    secondary={`${manager.email}`} 
                                                                />
                                                                <Button
                                                                    variant="outlined"
                                                                    onClick={() => setExpandedManager(expandedManager === manager.id ? null : manager.id)}
                                                                    endIcon={expandedManager === manager.id ? <ExpandLess /> : <ExpandMore />}
                                                                >
                                                                    Voir vendeurs
                                                                </Button>
                                                            </ListItem>

                                                            {/* ✅ Vendeurs sous chaque manager */}
                                                            <Collapse in={expandedManager === manager.id}>
                                                                <List sx={{ pl: 4 }}>
                                                                    <Typography variant="subtitle1">🛒 Vendeurs</Typography>
                                                                    {(manager.ManagedVendors || []).length > 0 ? (
                                                                        manager.ManagedVendors.map((vendor) => (
                                                                            <ListItem key={vendor.id}>
                                                                                <ListItemText 
                                                                                    primary={`${vendor.first_name} ${vendor.last_name}`} 
                                                                                    secondary={`${vendor.email}`} 
                                                                                />
                                                                            </ListItem>
                                                                        ))
                                                                    ) : (
                                                                        <Typography sx={{ p: 2, color: "gray" }}>Aucun vendeur</Typography>
                                                                    )}
                                                                </List>
                                                            </Collapse>
                                                        </Paper>
                                                    ))
                                                ) : (
                                                    <Typography sx={{ p: 2, color: "gray" }}>Aucun manager</Typography>
                                                )}
                                            </List>
                                        </Collapse>
                                    </Paper>
                                ))}
                            </List>
                        ) : (
                            <Typography sx={{ p: 2, color: "gray" }}>Aucun site associé</Typography>
                        )}
                    </Paper>

                    {/* ✅ Administrateurs */}
                    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            <People sx={{ verticalAlign: "middle", mr: 1 }} /> Administrateurs
                        </Typography>
                        {(company.Users || []).length > 0 ? (
                            <List>
                                {company.Users.map((user) => (
                                    <ListItem key={user.id}>
                                        <ListItemText 
                                            primary={`${user.first_name} ${user.last_name}`} 
                                            secondary={`📧 ${user.email}`} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography sx={{ p: 2, color: "gray" }}>Aucun administrateur</Typography>
                        )}
                    </Paper>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CompanyPopup;
