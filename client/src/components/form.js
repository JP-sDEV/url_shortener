import React, { useState } from "react";
import { Grid, TextField, Button, FormControl } from '@mui/material';

export const Form = () => {

    const [formData, setFormData] = useState({
        shortUrl: null 
    })

    const handleTextInput = (e) => {
        setFormData({
            ...formData, 
            shortUrl: e.target.value
        })
    }

    // todo 
    const handleSubmit = () => {
    }

    return (
        <div>
            <h1>FORMS</h1>
            <FormControl>
                
                <TextField 
                    required
                    fullWidth
                    value = {formData.shortUrl}
                    onChange = {(e) => handleTextInput(e)}
                />
                <Button variant="outlined" onSubmit={handleSubmit}>Shorten</Button>

            </FormControl>
        </div>
    )
   
}