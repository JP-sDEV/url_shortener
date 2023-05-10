import React from "react"
import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import GitHubLogo from "../icons/github.svg"

export const NavBar = () => {

    return (
        <Box>
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <a href="https://github.com/JP-sDEV/url_shortener" target="_blank" rel="noopener noreferrer">
                    <img src={GitHubLogo} style={{width: "2rem"}}/>
                </a>

            {/* fills the mid part (puts buttons on each side) */}
                <Typography sx={{ flexGrow: 1 }} />

            </Toolbar>
        </AppBar>
        </Box>
    );
}