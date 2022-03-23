import React, { useState } from "react";
import { Grid, TextField, Button, FormControl } from '@mui/material';

export const Form = () => {

    const [formData, setFormData] = useState({
        fullUrl: null 
    })

    const handleTextInput = (e) => {
        setFormData({
            ...formData, 
            fullUrl: e.target.value
        })
    }

    const handleSubmit  = (e) => {

        const urlForm = {
            "full": formData.fullUrl
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(urlForm)
        }

        fetch("/shortUrls", requestOptions)
        .then(res => res.json())
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <TextField 
                        required
                        fullWidth
                        label="Full Url"
                        value = {formData.shortUrl}
                        onChange = {(e) => handleTextInput(e)}
                    />
                    <Button variant="outlined" type="submit" >Shorten</Button>
                </FormControl>
            </form>
        </div>
    )
   
}