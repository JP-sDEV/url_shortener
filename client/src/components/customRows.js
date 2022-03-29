import React, { useContext } from "react";
import { TableCell, TableRow, Button } from '@mui/material';

 import { AppContext } from "../context"

 export const CustomRows = ({_id, full, short, clicks, created}) => {
     
    const {state: [state, setState]} = useContext(AppContext)

    const handleShortUrlClick = (e) => {
        fetch(`/${e.target.value}`)
        .then(res => res.json())
        .then(data =>  (window.open(data.url, "_blank")))
      } 

      const handleDelete = (e) => {

        const delForm = {
          "id": e.target.value
        }
     
        const requestOptions = {
          method: "DELETE",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(delForm)
        }
          fetch("/delUrl", requestOptions)
          .then(res => res.json())
          .then(data => setState({
            ...state,
            data: data.urls
          }))
          .catch((err) => {
            console.log(err)
          })
      }

     return (
        <TableRow
        key={_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        hover={true}>

            <TableCell align="left">
            <Button href={full} target="_blank">
                {full}
            </Button>
            </TableCell>

            <TableCell align="center">
            <Button onClick={(e) => handleShortUrlClick(e)} variant="text" value={short}>
                https://{short}.shorty
            </Button>
            </TableCell>

            <TableCell align="center">{clicks}</TableCell>

            <TableCell align="center" >
            {created.slice(0,10)}
            </TableCell>

            <TableCell align="center" >
            <Button onClick={(e) => handleDelete(e)} value={_id}>🗑️</Button>
            </TableCell>

      </TableRow>
     )
 }