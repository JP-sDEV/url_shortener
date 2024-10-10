import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import { Form } from "./form.js";

export const Modal = () => {
  return (
    <Container component="main" maxWidth="lg">
      <Paper
        variant="outlined"
        sx={{
          mt: { xs: 0 },
          mb: { xs: 1 },
          p: { xs: 1 },
        }}
      >
        <Typography variant="h3" align="center">
          .Shorty URL
        </Typography>
        <Form />
      </Paper>
    </Container>
  );
};
