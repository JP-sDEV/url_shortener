import React, { useContext } from "react";
import { TableCell, TableRow, Button } from "@mui/material";
import { AppContext } from "../context";
import { getShortUrl } from "../helpers/getters";
import { deleteShortUrl } from "../helpers/deletes";

export const CustomRows = ({ full, short, clicks, created }) => {
  const {
    state: [state, setState],
  } = useContext(AppContext);

  const handleShortUrlClick = async (e) => {
    const url = await getShortUrl(e.target.value);
    window.open(url, "_blank");
  };

  const handleCopyToClipBoard = async (e) => {
    await navigator.clipboard.writeText(
      `${process.env.REACT_APP_SERVER_URL}/v1/urls/${e.target.value}`
    );
    alert(".Shorty Copied!");
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const data = await deleteShortUrl(e.target.value, state.userId);

    setState((prevState) => ({
      ...prevState,
      data: data.urls,
    }));
  };

  return (
    <TableRow
      key={short}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      hover={true}
    >
      <TableCell align="left">
        <Button href={full} target="_blank">
          {full}
        </Button>
      </TableCell>

      <TableCell align="center">
        <Button
          onClick={(e) => handleShortUrlClick(e)}
          variant="text"
          value={short}
        >
          https://{short}.shorty
        </Button>
        <Button onClick={(e) => handleCopyToClipBoard(e)} value={short}>
          📋
        </Button>
      </TableCell>

      <TableCell align="center">{clicks}</TableCell>

      <TableCell align="center">{created.slice(0, 10)}</TableCell>

      <TableCell align="center">
        <Button onClick={(e) => handleDelete(e)} value={short} type="button">
          🗑️
        </Button>
      </TableCell>
    </TableRow>
  );
};
