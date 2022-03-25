import React from "react";
import { Container, Paper, Typography, Button } from '@mui/material';

import { Form } from "./form.js"

export const Modal = () => {

    const handleAuthRedirect = () => {
        window.open("http://localhost:5000/auth/google", "_self")
      }

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

                {/* test button for OAuth, for dev purposes */}
                <Button onClick={handleAuthRedirect}>
                    GOOGLE LOGIN
                </Button>

                <Form />
            </Paper> 
        </Container>
    )
   
}