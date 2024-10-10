import React, { useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

import { CustomRows } from "./customRows";
import { AppContext } from "../context";

export const LinkViews = () => {
  const {
    state: [state, setState],
  } = useContext(AppContext);

  const tabSx = {
    ".MuiTabs-indicator": {
      top: 0,
    },
  };

  const handleChange = (e, newValue) => {
    setState((prevState) => ({
      ...prevState,
      viewType: newValue,
    }));
  };

  const renderViewType = () => {
    // display all short urls
    if (state.viewType === "all") {
      return state.data.urls && state.data.urls.length > 0 ? (
        state.data.urls.map((u) => (
          <CustomRows
            key={u._id}
            _id={u._id}
            full={u.full}
            short={u.short}
            clicks={u.clicks}
            created={u.created}
            user={u.user}
          />
        ))
      ) : (
        // Use TableRow and TableCell to show loading message in a table format
        <TableRow>
          <TableCell colSpan={6} align="center">
            Loading URLs...
          </TableCell>
        </TableRow>
      );
    } else {
      // display users short urls
      return state.data.userUrls.map((post) => (
        <CustomRows
          key={post._id}
          _id={post._id}
          full={post.full}
          short={post.short}
          clicks={post.clicks}
          created={post.created}
          user={post.user}
        />
      ));
    }
  };

  return (
    <div style={{ margin: "1.5rem" }}>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs
          value={state.viewType}
          onChange={handleChange}
          centered
          variant="fullWidth"
          sx={tabSx}
        >
          <Tab label="all shortys" value="all" sx={tabSx} />

          {state.user.id ? (
            <Tab label={`${state.user.name}'s shortys`} value="user" />
          ) : (
            ""
          )}
        </Tabs>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <TableContainer
          component={Paper}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Table style={{ tableLayout: "auto" }} aria-label="custom table">
            <TableHead>
              <TableRow style={{ backgroundColor: "#434343" }}>
                <TableCell align="center" style={{ color: "#f5f5f5" }}>
                  Original Link (Full Url)
                </TableCell>
                <TableCell align="center" style={{ color: "#f5f5f5" }}>
                  Shortened Url
                </TableCell>
                <TableCell align="center" style={{ color: "#f5f5f5" }}>
                  Shortened Url Clicks
                </TableCell>
                <TableCell
                  align="center"
                  style={{ color: "#f5f5f5" }}
                ></TableCell>
                <TableCell align="center" style={{ color: "#f5f5f5" }}>
                  Date Created (UTC)
                </TableCell>
                <TableCell align="center" style={{ color: "#f5f5f5" }}>
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>{renderViewType()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
