import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Business, People, Store, Category, LocalOffer, Home, Logout, Add, ChevronLeft, ChevronRight, PersonAdd, DomainAdd, Category as CategoryIcon, PersonAddAlt1, Apartment, Work, GroupAdd } from '@mui/icons-material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';


const drawerWidth = 240;
const collapsedDrawerWidth = 70;

const DashboardLayout = ({ user, onLogout }) => {  
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon color="info" />, path: '/' },
        { text: 'Entreprises', icon: <Business color="info" />, path: '/entreprises' },
        { text: 'Transactions', icon: <AccountBalanceIcon color="info" />, path: '/transactions' },
        { text: 'Clients', icon: <PeopleAltIcon color="info" />, path: '/clients' },
    ];

    const addItems = [
        { text: 'Ajouter Secteur', icon: <CreateNewFolderIcon color="info" />, path: '/ajouter-secteur' },
        { text: 'Ajouter Catégorie', icon: <LibraryAddIcon color="info" />, path: '/ajouter-categorie' },
        { text: 'Ajouter Assureur', icon: <DataSaverOnIcon color="info" />, path: '/ajouter-assureur' },
        { text: 'Ajouter Assurance', icon: <AddModeratorIcon color="info" />, path: '/ajouter-assurance' },
        { text: 'Ajouter Entreprise', icon: <DomainAddIcon color="info" />, path: '/ajouter-entreprise' },
        { text: 'Ajouter Utilisateur', icon: <PersonAddAlt1 color="info" />, path: '/ajouter-utilisateur' },
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
                {menuItems.map((item, index) => (
                    <Tooltip key={index} title={collapsed ? item.text : ""} placement="right"> {/* ✅ Ajout du `key` */}
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
                    {addItems.map((item, index) => (
                    <Tooltip key={index} title={collapsed ? item.text : ""} placement="right"> {/* ✅ Ajout du `key` */}
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
