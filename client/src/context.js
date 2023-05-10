import React, { useState, useEffect, createContext } from "react";
import { createTheme } from '@mui/material/styles';
export const AppContext = createContext(null)

export default ({children}) => {

    const [state, setState] = useState({ 
        data: [], 
        userId: null,
        name: null
    });

    const [theme] = useState({

        main:createTheme({
            palette: {
              primary: {
                main: "#434343",
              }
            },
            typography: {
              fontFamily: 'Courier New'
            }
          })
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/allUrls`)
          const resData = await res.json()
          setState(prevState => ({
            ...prevState, 
            data: resData.urls
          }));
        } catch (error) {
          console.error(error)
        }
      }
      fetchData();
    }, []);

    const store = {
        state: [state, setState],
        theme: [theme]
    }

    return <AppContext.Provider value={store}>{children}</AppContext.Provider>

    }