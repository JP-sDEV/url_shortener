import React from "react";
import { Container, Paper, Typography } from '@mui/material';

import { Form } from "./form.js"

export const Modal = () => {
    
    return (
        <Container Container
                        component="main"
                        maxWidth="lg"
            >
            <Paper 
                variant="outlined" 
                sx={{ 
                    my: { xs: 3, m: 3 },
                    p: { xs: 1, m: 3 }
                    }}
                >
                <Typography 
                    variant="h3"
                    align="center"
                    >
                    .Shorty URL
                </Typography>
                <Form />
            </Paper> 
        </Container>
    )
   
}