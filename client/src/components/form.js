import React, { useState } from "react";
import { TextField, Button, FormControl } from '@mui/material';

export const Form = () => {

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

        e.preventDefault();

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
            body: await JSON.stringify(urlForm)
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/shortUrls`, requestOptions)
            
            if (!response.ok)
            {
                throw new Error("Network response was not 'ok'")
            }
            console.log("Url Shortened!")
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