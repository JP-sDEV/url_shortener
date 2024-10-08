import React, { useContext } from "react";
import { TableCell, TableRow, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import { getShortUrl } from "../helpers/getters";
import { deleteShortUrl } from "../helpers/deletes";
import { mutate } from "swr";

export const CustomRows = ({ full, short, clicks, created }) => {
  const {
    state: [state],
  } = useContext(AppContext);

  const navigate = useNavigate();

  const handleShortUrlClick = async (e) => {
    const url = await getShortUrl(e.target.value);
    window.open(url, "_blank");
  };

  const handleCopyToClipBoard = async (e) => {
    await navigator.clipboard.writeText(
      `${process.env.SERVER_URL}/v1/urls/${e.target.value}`
    );
    alert(".Shorty Copied!");
  };

  const handleSummary = async (e) => {
    navigate(`/urls/${e.target.value}`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    await deleteShortUrl(e.target.value, state.user.id);

    mutate(`${process.env.SERVER_URL}/v1/urls?page=${state.page}`);
  };

  return (
    <TableRow
      key={short}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      hover={true}
    >
      <TableCell align="center">
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

      <TableCell align="center">
        <Button
          onClick={(e) => handleSummary(e)}
          variant="outlined"
          value={short}
        >
          Summary
        </Button>
      </TableCell>

      <TableCell align="center">{created.slice(0, 10)}</TableCell>

      <TableCell align="center">
        <Button onClick={(e) => handleDelete(e)} value={short} type="button">
          🗑️
        </Button>
      </TableCell>
    </TableRow>
  );
};
