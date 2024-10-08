import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { NavBar } from "./components/navBar";
import { Modal } from "./components/modal";
import { LinkViews } from "./components/linkViews";
import { LocationSummary } from "./components/locationSummary";
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

        <Router>
          <Routes>
            <Route
              path="/urls/:id"
              element={
                <>
                  <LocationSummary />
                  <LinkViews />
                </>
              }
            />
            <Route path="/" element={<LinkViews />} />
          </Routes>
        </Router>

        {/* <LinkViews /> */}
      </ThemeProvider>
    </div>
  );
}

export default App;
