import React, { useState } from "react";
import { TextField, Button, FormControl } from '@mui/material';

export const Form = () => {

    const [formData, setFormData] = useState({
        fullUrl: null,
        submitBlock: true
    })

    const handleTextInput = (e) => {
        setFormData({
            ...formData, 
            fullUrl: e.target.value,
            submitBlock: false
        })
    }

    const handleSubmit  = async () => {

        const urlForm = {
            "full": formData.fullUrl
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(urlForm)
        }

        await fetch(`${process.env.REACT_APP_SERVER_URL}/shortUrls`, requestOptions)
        .then(res => res.json())

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
                        value = {formData.shortUrl}
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