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

    const handleSubmit = () => {

        const urlForm = {
            "full": formData.fullUrl
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            mode: 'cors',
            body: JSON.stringify(urlForm)
        }

        try {
            fetch(`${process.env.REACT_APP_SERVER_URL}/shortUrls`, requestOptions)
            .then(() => console.log("URL Shortened!"));
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