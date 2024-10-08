import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import { Modal, Box, Button, Typography } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const LocationSummary = () => {
  const {
    state: [state],
  } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [urlData, setUrlData] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !state?.data?.urls) {
      return;
    }

    const data = state.data.urls.find((url) => url.short === id);

    if (data) {
      setOpen(true);
      setUrlData(data);
    }
  }, [id, state.data.urls]);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "50%",
    width: "35%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ pb: 2 }}
          >
            View Stats for: {urlData && urlData.short ? urlData.short : ""}
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Country</TableCell>
                  <TableCell align="center">Views</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urlData && urlData.accessed ? (
                  Object.keys(urlData.accessed).map((country, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{country}</TableCell>
                      <TableCell align="center">
                        {urlData.accessed[country]}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, alignSelf: "flex-end" }} // Aligns the button to the right
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
