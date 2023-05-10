import React, { useState, useContext } from "react";
import { TextField, Button, FormControl } from '@mui/material';

import { AppContext } from "../context"


export const Form = () => {
    const {state: [state, setState]} = useContext(AppContext)

    const [formData, setFormData] = useState({
        fullUrl: "",
        submitBlock: true
    })

    const handleTextInput = (e) => {
        setFormData({
            ...formData, 
            fullUrl: e.target.value,
            submitBlock: false
        })
    }

    const handleSubmit = async (e) => {

        const urlForm = {
            "full": formData.fullUrl
        }

        const requestOptions = {
            method: 'POST',
            headers: 
            { 
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(urlForm).length.toString()
            },
            body: JSON.stringify(urlForm)
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/shortUrls`, requestOptions)
            
            if (response.ok)
            {
                const data = await response.json();

                setState({
                    ...state,
                    data: data.urls
                })
            }
            else 
            {
                throw new Error("Network response was not 'ok'")

            }
            
            console.log("Url Shortened!")
            setFormData({
                fullUrl: "",
                submitBlock: true
            })
        }
        catch(err)
        {
            console.error(err);
        }
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit} style={{padding: "0 5%"}}>
                <FormControl
                    fullWidth
                    margin="normal"
                    sx={{ 
                        display: "flex",
                        flexDirection: "row"
                        }}
                    >

                    <TextField 
                        required
                        label="Full Url"
                        size="normal"
                        value = {formData.fullUrl}
                        fullWidth
                        onChange = {(e) => handleTextInput(e)}
                    />

                    <Button 
                        variant="outlined"
                        type="submit"
                        sx={{ 
                            ml: "1%"
                            }}
                        disabled={formData.submitBlock}
                    >
                        Shorten
                    </Button>

                </FormControl>
            </form>
        </div>
    )
   
}