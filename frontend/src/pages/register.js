import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { Button, TextField, Grid, Box, Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link, useLocation } from 'react-router-dom';

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @param {function} onLogin deliver user detail information 
 * @returns {JXH} JXH code for the register
 */
function Register({ onLogin, sendSnackbar }) {
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState({
    username: "",
    password: "",
    email: "",
    dob: "",
    firstName: "",
    lastName: "",
    gender: "",
    cardNumber: "",
    expiryDate: '',
    cvc: "",
    biography: "",
    student: false
  })

  //check validation of the input to enable the submit button
  useEffect(() => {
    if (!Object.values(input).includes('')) { setValid(false) }
    else { setValid(true) }
  }, [input])

  //store the input from the text field
  const handleChange = (event) => {
    if (event.target.name === 'student') {
      setInput({ ...input, [event.target.name]: event.target.checked })
    } else {
      setInput({ ...input, [event.target.name]: event.target.value })
    }
  }

  //call the endpoint to save the user profile to the db
  const handleSubmit = (event) => {
    event.preventDefault()
    fetch('http://localhost:5000/auth/register', {
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
              sendSnackbar({ open: true, message: "Registered in successfully!", severity: 'success' })
              setTimeout(() => { location.pathname === '/' ? window.location.reload() : navigate('/') }, 1000);
            }
          })
      })
  }
  
  return (
    <>
      <Box sx={{ mt: 20, width: "100%", display: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 500 }}>
          <form name='register' onSubmit={handleSubmit}>
            <Grid container direction='column' spacing={3}>
              <Grid item>
                <Typography sx={{ mb: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Register</Typography>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.username} type='text' label='Username' name='username' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.firstName} type='text' label='First Name' name='firstName' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.lastName} type='text' label='Last Name' name='lastName' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.password} type='password' label='Password' name='password' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.email} type='email' label='Email' name='email' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField inputProps={{ max: new Date().toISOString().split('T')[0] }} sx={{ width: "100%" }} value={input.dob} type='date' label='Date of Birth' name='dob' InputLabelProps={{ shrink: true }} onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.cardNumber} type='number' label='Card Number' name='cardNumber' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField inputProps={{ min: new Date().toISOString().split('T')[0] }} sx={{ width: "100%" }} value={input.expiryDate} type='date' label='Expiry Date' name='expiryDate' InputLabelProps={{ shrink: true }} onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField inputProps={{ maxLength: 3 }} sx={{ width: "100%" }} value={input.cvc} type='number' label='CVC' name='cvc' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.gender} type='text' label='Gender' name='gender' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField sx={{ width: "100%" }} value={input.biography} multiline maxRows={Infinity} type='text' label='Biography' name='biography' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <FormControlLabel sx={{ width: "100%" }} name='student' control={<Checkbox checked={input.student ? true : false} onChange={handleChange} />} label="Are you currently a student?" />
              </Grid>
              <Grid item sx={{ mt: 10, mb: 20, justifyContent: "center", display: 'center' }}>
                <Button disabled={valid} variant='contained' type='submit'>Submit</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default Register;
