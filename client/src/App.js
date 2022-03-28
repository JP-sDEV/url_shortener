import React, { useEffect, useContext } from "react"
import { ThemeProvider } from '@mui/material/styles';
import { NavBar } from "./components/navBar";
import {Modal} from "./components/modal"
import { LinkViews } from "./components/linkViews"
import  { AppContext }  from "./context";
import './App.css';

function App() {

  const { state: [state, setState], theme:[theme]} = useContext(AppContext)

  useEffect(() => {

    const fetchUrls = async () => {
      const res = await fetch("/allUrls")
      const data = await res.json() 
      
      await setState({
        ...state, 
        data: data.urls
      })
    }

    fetchUrls()
    
}, [])

  return (
    <div className="App">
      <ThemeProvider theme={theme.main} >
        <NavBar />
        <Modal />
        <LinkViews />
      </ThemeProvider>

    </div>
  );
}

export default App;
