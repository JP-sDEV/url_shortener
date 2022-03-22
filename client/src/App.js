import React, { useState, useEffect } from "react"
import './App.css';

import {Modal} from "./components/modal"

function App() {
  
  const [state, setState] = useState("")
  
  useEffect(() => {
    fetch("/home")
    .then(res => res.json())
    .then(data => setState(data))
  }, [])

  return (
    <div className="App">
      <Modal />
      <p>{state.express}</p>
    </div>
  );
}

export default App;
