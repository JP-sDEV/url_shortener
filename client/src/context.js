import React, { useState, useEffect, createContext } from "react";
import { createTheme } from "@mui/material/styles";
import { getProfile, getUserUrls } from "./helpers/getters";
import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include", // Include cookies in the request
  });

  // Check if the response is OK, otherwise throw an error
  if (!response.ok) throw new Error("Error fetching data");

  return response.json(); // Return the JSON data directly
};

// Define the AppContext
export const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    data: {
      urls: [],
      userUrls: [],
    },
    user: {
      id: null,
      name: null,
    },
    page: 1,
    viewType: "all",
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

  // Use SWR to fetch URLs
  const { data: swrData, error: urlsError } = useSWR(
    `${process.env.REACT_APP_SERVER_URL}/v1/urls?page=${state.page}`,
    fetcher
  );

  // Update the state when URLs are fetched
  useEffect(() => {
    if (swrData) {
      setState((prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          urls: swrData.urls, // Update the state with the fetched URLs
        },
      }));
    }
  }, [swrData]); // Only run when URLs change

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setState((prevState) => ({
            ...prevState,
            user: {
              id: data.id || null,
              name: data.name || null,
            },
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []); // Only run once on mount

  // Fetch user urls
  useEffect(() => {
    const fetchUserUrls = async () => {
      if (state.user.id) {
        try {
          const data = await getUserUrls(state.user.id);
          if (data) {
            setState((prevState) => ({
              ...prevState,
              data: {
                ...prevState.data,
                userUrls: data || [],
              },
            }));
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setState((prevState) => ({
          ...prevState,
          user: {
            id: null,
            name: null,
          },
        }));
      }
    };

    fetchUserUrls();
  }, [state.user.id, swrData]); // Run when user logs out, or when url list changes

  // Handle loading and error states
  if (urlsError) return <div>Error loading URLs</div>;
  if (!swrData) return <div>Loading...</div>;

  console.log("SWR Data: ", swrData);

  const store = {
    state: [state, setState],
    theme: [theme],
  };

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export default AppProvider;
