import React, { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { NavBar } from "./components/navBar";
import { Modal } from "./components/modal";
import { LinkViews } from "./components/linkViews";
import { AppContext } from "./context";
import "./App.css";

function App() {
  const {
    theme: [theme],
  } = useContext(AppContext);

  return (
    <div className="App">
      <ThemeProvider theme={theme.main}>
        <NavBar />
        <Modal />
        <LinkViews />
      </ThemeProvider>
    </div>
  );
}

export default App;
