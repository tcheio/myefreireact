import React from 'react';
import { Typography, Container } from '@mui/material';

const Dashboard = () => {

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Bienvenue sur le Dashboard 🎉
            </Typography>
            <Typography variant="body1">
                Sélectionnez une option dans le menu latéral pour commencer.
            </Typography>
        </Container>
    );
};

export default Dashboard;
