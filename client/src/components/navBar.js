import React, { useContext } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import GitHubLogo from "../icons/github.svg";
import { AppContext } from "../context";

export const NavBar = () => {
  const {
    state: [state, setState],
  } = useContext(AppContext);

  const handleAuthRedirect = () => {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
  };

  const handleLogout = async () => {
    const logout = async () => {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    };

    await logout();

    setState((prevState) => ({
      ...prevState,
      user: {
        id: null,
        name: null,
      },
      data: {
        ...prevState.data,
        userUrls: [],
      },
      viewType: "all",
    }));
  };

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <a
            href="https://github.com/JP-sDEV/url_shortener"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={GitHubLogo} style={{ width: "2rem" }} alt="" />
          </a>

          {/* fills the mid part (puts buttons on each side) */}
          <Typography sx={{ flexGrow: 1 }} />

          {state.user.id ? (
            <div>
              <Typography variant="button" sx={{ mr: { xs: 2 } }}>
                Hi {state.user.name}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleLogout}
                color="inherit"
                sx={{}}
              >
                LOGOUT
              </Button>
            </div>
          ) : (
            <Button
              variant="outlined"
              onClick={handleAuthRedirect}
              color="inherit"
              sx={{}}
            >
              GOOGLE LOGIN
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
