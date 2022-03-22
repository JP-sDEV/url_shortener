import React, { useState } from "react";

export const AppContext = React.createContext(null)

export default ({ children }) => {
    
    const [state, setState] = useState({
        data: []
    })

    const store = {
        state: [state, setState]
    }

    return <AppContext.Provider value={store}>{children}</AppContext.Provider>

}