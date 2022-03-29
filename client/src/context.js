import React, { useState, createContext } from "react";
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

    const store = {
        state: [state, setState],
        theme: [theme]
    }

    return <AppContext.Provider value={store}>{children}</AppContext.Provider>

    }