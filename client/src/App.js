import React, { useEffect, useContext } from "react"
import { ThemeProvider } from '@mui/material/styles';
import { NavBar } from "./components/navBar";
import { Modal } from "./components/modal";
import { LinkViews } from "./components/linkViews";
import { AppContext } from "./context";
import './App.css';

function App() {

  const { state: [state, setState], theme: [theme] } = useContext(AppContext)
  useEffect(() => {
    const fetchData = async () => {
      console.log(process.env.REACT_APP_SERVER_URL);
      try {
        // const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/allUrls`)
        const res = await fetch("/allUrls")
        const resData = await res.json()
        console.log("ResData: ", resData);
        await setState({
          ...state, 
          data: resData.urls,
          userId: resData.userId,
          name: resData.name
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
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
