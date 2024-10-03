import React, { useState, useEffect, createContext, cache } from "react";
import { createTheme } from "@mui/material/styles";
import { getAllUrls, getProfile } from "./helpers/getters";

export const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    data: [],
    userId: null,
    name: null,
    page: 1,
  });

  const [theme] = useState({
    main: createTheme({
      palette: {
        primary: {
          main: "#434343",
        },
      },
      typography: {
        fontFamily: "Courier New",
      },
    }),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUrls();
        setState((prevState) => ({
          ...prevState,
          data: data.urls,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        if (data) {
          setState((prevState) => ({
            ...prevState,
            userId: data.id ? data.id : null,
            name: data.name ? data.name : null,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchProfile();
  }, [setState]);

  const store = {
    state: [state, setState],
    theme: [theme],
  };

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export default AppProvider;
