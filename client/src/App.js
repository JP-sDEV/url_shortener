import React, { useEffect, useContext } from "react"
import { ThemeProvider } from '@mui/material/styles';
import {Modal} from "./components/modal"
import { LinkViews } from "./components/linkViews"
import  { AppContext }  from "./context";
import './App.css';

function App() {

  const { state: [state, setState], theme:[theme]} = useContext(AppContext)

  useEffect(() => {
    fetch("/allUrls")
    .then(res => res.json())
    .then((data) => setState({
      ...state,
      data: data.urls
    }))
  }, [state.data])

  return (
    <div className="App">
      <ThemeProvider theme={theme.main} >
        <Modal />
        <LinkViews />
      </ThemeProvider>

    </div>
  );
}

export default App;
