import React, { useState, useContext } from "react";
import { TextField, Button, FormControl } from "@mui/material";
import { AppContext } from "../context";
import { getAllUrls } from "../helpers/getters";

export const Form = () => {
  const {
    state: [state, setState],
    page: page,
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    fullUrl: "",
    submitBlock: true,
  });

  const handleTextInput = (e) => {
    setFormData({
      ...formData,
      fullUrl: e.target.value,
      submitBlock: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlForm = {
      full: formData.fullUrl,
      user: state.userId ? state.userId : null,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(urlForm),
    };

    try {
      // POST request
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/v1/urls`,
        requestOptions
      );

      // Get request
      if (response.ok) {
        try {
          const data = await getAllUrls(page);
          setState((prevState) => ({
            ...prevState,
            data: data.urls,
          }));
        } catch (error) {
          console.error(error);
        }
      } else {
        throw new Error("Network response was not 'ok'");
      }

      setFormData({
        fullUrl: "",
        submitBlock: true,
      });

      console.log("State: ", state.userId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ padding: "0 5%" }}>
        <FormControl
          fullWidth
          margin="normal"
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TextField
            required
            label="Full Url"
            size="normal"
            value={formData.fullUrl}
            fullWidth
            onChange={(e) => handleTextInput(e)}
          />

          <Button
            variant="outlined"
            type="submit"
            sx={{
              ml: "1%",
            }}
            disabled={formData.submitBlock}
          >
            Shorten
          </Button>
        </FormControl>
      </form>
    </div>
  );
};
