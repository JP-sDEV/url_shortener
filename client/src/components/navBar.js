import React, {useContext} from "react"
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import GitHubLogo from "../icons/github.svg"
import {AppContext} from "../context";

export const NavBar = () => {

    const {state: [state, setState]} = useContext(AppContext)

    return (
        <Box>
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <a href="https://github.com/JP-sDEV/url_shortener" target="_blank">
                    <img src={GitHubLogo} style={{width: "2rem"}}/>
                </a>

            {/* puts buttons on each side */}
                <Typography sx={{ flexGrow: 1 }} />


                {
                    state.userId ? 
                        <Button color="inherit" sx={{ }}>LOGOUT</Button>
                        :
                        <Button color="inherit" sx={{ }}>GOOGLE LOGIN</Button>
                }
            </Toolbar>
        </AppBar>
        </Box>
    );
}