import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Button, TextField, Grid, Typography, Box } from '@mui/material'

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @returns {JXH} JXH code for the payment
 */
function Payment({ sendSnackbar }) {
    const location = useLocation();
    const [cookies] = useCookies(['token']);
    const [detail, setDetail] = useState({ cardNumber: undefined, cvc: undefined, expiryDate: undefined });
    const [order, setOrder] = useState({ id: undefined, price: undefined, selectedSeats: undefined });

    const navigate = useNavigate();

    //fetch the card information by call the profile endpoint
    useEffect(() => {
        setOrder(location.state.input)
        fetch('http://localhost:5000/auth/user/profile', {
            method: 'GET',
            headers: {
                'token': cookies.token
            }
        })
            .then(response => {
                response.json()
                    .then(data => {
                        if (data.error) {
                            console.log(data.error);
                        }
                        else {
                            console.log(data);
                            setDetail(data)
                        }
                    })
            })
    }, [cookies.token, location])

    //call the event join endpoint to confrim the joining
    const handleSubmit = (event) => {
        fetch('http://localhost:5000/main_page/event_join', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'token': cookies.token
            },
            body: JSON.stringify(order)
        })
            .then(response => {
                response.json()
                    .then(data => {
                        if (data.error) {
                            sendSnackbar({ open: true, message: data.error, severity: 'error' })
                        }
                        else {
                            setDetail({ cardNumber: undefined, cvc: undefined, expiryDate: undefined })
                            setOrder({ id: undefined, price: undefined, selectedSeats: undefined })

                            sendSnackbar({ open: true, message: "Joined successfully!", severity: 'success' })
                            navigate(-2);
                        }
                    })
            })
    }

    //link to seat selection page when the user click the back button
    const handleBack = (event) => {
        navigate(-1);
    }
    
    return (
        <>
            <Box sx={{ mt: 20, width: "100%", display: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 500 }}>
                    <Grid container direction='column' spacing={5}  >
                        <Grid item>
                            <Typography sx={{ mb: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Total: ${order.price}</Typography>
                        </Grid>
                        <Grid item>
                            <TextField sx={{ width: "100%" }} value={detail.cardNumber} type='number' label='Card Number' name='cardNumber' disabled={true} InputLabelProps={{ shrink: true }}></TextField>
                        </Grid>
                        <Grid item>
                            <TextField sx={{ width: "100%" }} value={detail.expiryDate !== undefined ? detail.expiryDate.slice(0, 7) : '0000-00'} type='month' label='Expiry Date' name='expiryDate' disabled={true} InputLabelProps={{ shrink: true }}></TextField>
                        </Grid>
                        <Grid item>
                            <TextField sx={{ width: "100%" }} value={detail.cvc} type='number' label='CVC' name='cvc' InputLabelProps={{ shrink: true }} disabled={true}></TextField>
                        </Grid>
                        <Grid item sx={{ mt: 5, mb: 20, justifyContent: "center", display: 'center' }}>
                            <Button sx={{ mr: 5 }} variant='contained' onClick={handleBack}>Back</Button>
                            <Button variant='contained' onClick={handleSubmit}>Pay</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}

export default Payment;