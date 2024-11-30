import React, { useEffect } from 'react';
import { useState } from 'react'
import { Button, TextField, Grid, Box, Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useCookies } from 'react-cookie';

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @param {function} onLogin deliver user detail information 
 * @returns {JXH} JXH code for the profile
 */
function Profile({ onLogin, sendSnackbar }) {

  const emptyInput = {
    username: "",
    password: "",
    email: "",
    dob: "",
    firstName: "",
    lastName: "",
    gender: "",
    cardNumber: "",
    expiryDate: undefined,
    cvc: "",
    biography: "",
    student: ""
  }
  const [input, setInput] = useState({ ...emptyInput })
  const [inputO, setInputO] = useState({ ...emptyInput })
  const [edit, setEdit] = useState(true)
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    fetch('http://localhost:5000/auth/user/profile', {
      method: 'GET',
      headers: {
        'token': cookies.token,
      }
    })
      .then(response => {
        response.json()
          .then(data => {
            if (data.error) {
              console.log(data.error)
            }
            else {
              data.password = ''
              if (edit) setInput({ ...data })
              setInputO({ ...data })
            }
          })
      })
  }, [cookies, edit])

  const handleChange = (event) => {
    if (event.target.name === 'student') {
      setInput({ ...input, [event.target.name]: event.target.checked })
    } else {
      setInput({ ...input, [event.target.name]: event.target.value })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.target.reset()
    let filteredInput = Object.fromEntries(Object.entries(input).filter(([k, v]) => (!['', undefined].includes(v)) && (!['token', 'eventTags', 'eventsJoined', 'eventsHosted'].includes(k))))
    setEdit(true)
    fetch('http://localhost:5000/auth/user/edit', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'token': cookies.token,
      },
      body: JSON.stringify(filteredInput)
    })
      .then(response => {
        response.json()
          .then(data => {
            if (data.error) {
              sendSnackbar({ open: true, message: data.error, severity: 'error' })
            }
            else {
              event.target.reset()
              setEdit(false)
              sendSnackbar({ open: true, message: "Registered in successfully!", severity: 'success' })
              setTimeout(() => {
                window.location.reload()
              }, 1000);
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

                {!edit ?
                  <>
                    <Typography sx={{ justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Profile</Typography>
                    <Typography sx={{ mb: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h6">(Only the specified fields will be updated.)</Typography>
                  </>
                  :
                  <>
                    <Typography sx={{ mb: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Profile</Typography>
                  </>
                }
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.username} placeholder={inputO.username} InputLabelProps={{ shrink: true }} type='text' label='Username' name='username' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.firstName} placeholder={inputO.firstName} InputLabelProps={{ shrink: true }} type='text' label='First Name' name='firstName' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.lastName} placeholder={inputO.lastName} InputLabelProps={{ shrink: true }} type='text' label='Last Name' name='lastName' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <Typography sx={{ color: "#1976d2" }} variant="body1">The password will not display.</Typography>
                <TextField disabled={edit} sx={{ width: "100%" }} type='password' label='Password' name='password' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.email} placeholder={inputO.email} InputLabelProps={{ shrink: true }} type='email' label='Email' name='email' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField inputProps={{ max: new Date().toISOString().split('T')[0] }} InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.dob} placeholder={inputO.dob} InputLabelProps={{ shrink: true }} type='date' label='Date of Birth' name='dob' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.cardNumber} placeholder={inputO.cardNumber} InputLabelProps={{ shrink: true }} type='number' label='Card Number' name='cardNumber' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField inputProps={{ min: new Date().toISOString().split('T')[0] }} InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.expiryDate} placeholder={inputO.expiryDate !== undefined ? inputO.expiryDate.slice(0, 7) : '0000-00'} InputLabelProps={{ shrink: true }} type='date' label='Expiry Date' name='expiryDate' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.cvc} placeholder={inputO.cvc} InputLabelProps={{ shrink: true }} type='number' label='CVC' name='cvc' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.gender} placeholder={inputO.gender} InputLabelProps={{ shrink: true }} type='text' label='Gender' name='gender' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <TextField InputProps={{ readOnly: edit }} sx={{ width: "100%" }} value={input.biography} placeholder={inputO.biography} InputLabelProps={{ shrink: true }} multiline maxRows={Infinity} type='text' label='Biography' name='biography' onChange={handleChange}></TextField>
              </Grid>
              <Grid item>
                <FormControlLabel disabled={edit} sx={{ width: "100%" }} name='student' control={<Checkbox checked={input.student ? true : false} onChange={handleChange} />} label="Are you currently a student?" />
              </Grid>
              <Grid item sx={{ mt: 10, mb: 20, justifyContent: "center", display: 'center' }}>
                {edit ?
                  <Button onClick={e => { setEdit(false); setInput({ ...emptyInput, student: inputO.student }) }} variant='contained'> start Edit</Button>
                  :
                  <>
                    <Button sx={{ mr: 3 }} onClick={e => { setEdit(true); setInput({ ...inputO }) }} variant='contained' >Back</Button>
                    <Button variant='contained' type='submit'>submit</Button>
                  </>
                }
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default Profile;
