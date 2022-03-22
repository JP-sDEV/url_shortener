import React, { useState, useEffect, useContext } from "react"
import './App.css';

import {Modal} from "./components/modal"
import { LinkViews } from "./components/linkViews"
import  { AppContext }  from "./context";

function App() {
  
  const { state: [state, setState]} = useContext(AppContext)
  
  useEffect(() => {
    fetch("/allUrls")
    .then(res => res.json())
    .then((data) => setState(data))
  }, [])

  return (
    <div className="App">
      <Modal />
      <LinkViews />
    </div>
  );
}

export default App;