import React, { useContext } from "react";
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
 } from '@mui/material';

 import { AppContext } from "../context"


export const LinkViews = () => {

  const {state: [state, setState]} = useContext(AppContext)

  const handleShortUrlClick = (e) => {
    fetch(`/${e.target.value}`)
    .then(res => res.json())
    .then(data =>  (window.open(data.url, "_blank")))
  } 

    return(
      <div>
        <TableContainer component={Paper}>
          <Table style={{tableLayout: "fixed"}} sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Original Link (Full Url)</TableCell>
                <TableCell align="center">Shortened Url</TableCell>
                <TableCell align="center">Shortened Url Clicks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.data.map((u) => (
                <TableRow
                  key={u._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">
                    <Button href={u.full}>
                      {u.full}
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button onClick={(e) => handleShortUrlClick(e)} variant="text" value={u.short}>
                      {u.short}
                    </Button>
                  </TableCell>
                  <TableCell align="center">{u.clicks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
      </div>
    )
}