import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, Typography } from '@mui/material'

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @param {function} onLogin deliver user detail information 
 * @returns {JXH} JXH code for the login
 */
function Login({ onLogin, sendSnackbar }) {
  const [input, setInput] = useState({})
  const navigate = useNavigate();

  //store the input from any of the text fields
  const handleChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  //submit the input from the user to call the endpoint
  const handleSubmit = (event) => {
    event.preventDefault()
    event.target.reset()
    fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(input)
    })
      .then(response => {
        response.json()
          .then(data => {
            if (data.error) {
              sendSnackbar({ open: true, message: data.error, severity: 'error' })
            }
            else {
              onLogin(data)
              event.target.reset()
              sendSnackbar({ open: true, message: "Logged in successfully!", severity: 'success' })
              navigate('/')
            }
          })
      })
  }

  return (
    <>
      <Box sx={{ mt: 20, width: "100%", display: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 500 }}>
          <form name='login' onSubmit={handleSubmit}>
            <Grid container direction='column' spacing={3}>
              <Grid item>
                <Typography sx={{ mb: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Log in</Typography>
              </Grid>
              <Grid item>
                <TextField sx={{ width: '100%' }} value={input.username} type='text' label='Username' name='username' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: '100%' }} type='password' label='Password' name='password' onChange={handleChange}></TextField>
              </Grid>
              <Grid item sx={{ mt: 10, mb: 20, justifyContent: "center", display: 'center' }}>
                <Button variant='contained' type='submit'>Log in</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

    </>
  );
}

export default Login