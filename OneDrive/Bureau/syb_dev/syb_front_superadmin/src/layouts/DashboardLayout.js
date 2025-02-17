import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Business, People, Store, Category, LocalOffer, Home, Logout, Add, ChevronLeft, ChevronRight, PersonAdd, DomainAdd, Category as CategoryIcon, Apartment, Work, GroupAdd } from '@mui/icons-material';

const drawerWidth = 240;
const collapsedDrawerWidth = 70;

const DashboardLayout = ({ user, onLogout }) => {  
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <Home color="primary" />, path: '/' },
        { text: 'Assurances', icon: <LocalOffer color="secondary" />, path: '/assurances' },
        { text: 'Assureurs', icon: <Business color="action" />, path: '/assureurs' },
        { text: 'Entreprises', icon: <Store color="success" />, path: '/entreprises' },
        { text: 'Utilisateurs', icon: <People color="error" />, path: '/utilisateurs' },
        { text: 'Clients', icon: <People color="disabled" />, path: '/clients' },
        { text: 'Ventes', icon: <CategoryIcon color="warning" />, path: '/ventes' },
    ];

    const addItems = [
        { text: 'Ajouter Assurance', icon: <Add color="secondary" />, path: '/ajouter-assurance' },
        { text: 'Ajouter Assureur', icon: <DomainAdd color="action" />, path: '/ajouter-assureur' },
        { text: 'Ajouter Catégorie', icon: <CategoryIcon color="warning" />, path: '/ajouter-categorie' },
        { text: 'Ajouter Entreprise', icon: <Apartment color="success" />, path: '/ajouter-entreprise' },
        { text: 'Ajouter Secteur', icon: <Work color="info" />, path: '/ajouter-secteur' },
        { text: 'Ajouter Utilisateur', icon: <PersonAdd color="error" />, path: '/ajouter-utilisateur' },
    ];

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                onLogout();  
                navigate('/login', { replace: true });
            } else {
                console.error("Erreur lors de la déconnexion :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${collapsed ? collapsedDrawerWidth : drawerWidth}px)`, ml: `${collapsed ? collapsedDrawerWidth : drawerWidth}px` }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>

                    {user && (
                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                {user.first_name} 
                            </Typography>
                            <Avatar>{user.first_name?.charAt(0).toUpperCase()}</Avatar>
                        </Box>
                    )}

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1 }} /> Déconnexion
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" sx={{
                width: collapsed ? collapsedDrawerWidth : drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: collapsed ? collapsedDrawerWidth : drawerWidth, transition: "width 0.3s ease" },
            }}>
                <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ alignSelf: "flex-end", m: 1 }}>
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
                <Divider />
                
                <List>
                    {menuItems.map((item) => (
                        <Tooltip title={collapsed ? item.text : ""} placement="right">
                            <ListItem key={item.text} onClick={() => navigate(item.path)} sx={{ cursor: "pointer" }}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                {!collapsed && <ListItemText primary={item.text} />}
                            </ListItem>
                        </Tooltip>
                    ))} 
                </List>

                <Divider />

                <List>
                    <ListItem sx={{ pointerEvents: "none", opacity: 0.7 }}>
                        <ListItemIcon><Add /></ListItemIcon>
                        {!collapsed && <ListItemText primary="Ajouts" />}
                    </ListItem>
                    {addItems.map((item) => (
                        <Tooltip title={collapsed ? item.text : ""} placement="right">
                            <ListItem key={item.text} onClick={() => navigate(item.path)} sx={{ cursor: "pointer" }}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                {!collapsed && <ListItemText primary={item.text} />}
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 10 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
