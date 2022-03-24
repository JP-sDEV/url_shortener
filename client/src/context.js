import React, { useState, createContext } from "react";

export const AppContext = createContext(null)

export default ({children}) => {

    const [state, setState] = useState({ 
        data: []
    });

    const [theme] = useState({
        fontFamily: 'Courier New',
        textTransfrom: "none"
    });

    const store = {
        state: [state, setState],
        theme: theme
    }

    return <AppContext.Provider value={store}>{children}</AppContext.Provider>

    }