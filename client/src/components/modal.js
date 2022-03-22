import React from "react";
import { Container, Paper, Typography } from '@mui/material';

import { Form } from "./form.js"

export const Modal = () => {
    return (
        <Container Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    hello
                </Typography>

                <Form />
            </Paper> 
        </Container>
    )
   
}