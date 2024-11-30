import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/register';
import Login from './pages/login';
import Header from './pages/header';
import CreateEvent from './pages/createEvent';
import EventJoin from './pages/eventJoin';
import Payment from './pages/payment';
import Home from './pages/home';
import MyEvents from './pages/myEvents';
import Profile from './pages/profile';
import EventEdit from './pages/eventEdit';
import { CookiesProvider, useCookies } from 'react-cookie';
import Search from './pages/search';
import EventView from './pages/eventView';

import Snackbar from '@mui/material/Snackbar';
import React, { useState } from 'react'
import MuiAlert from '@mui/material/Alert';

/**
 * 
 * @returns {JXH} JXH code for the app
 */
function App() {
  const [cookies, setCookies, removeCookies] = useCookies(['token'])
  const [snackbarData, setSnackbarData] = useState({ open: false });

  //Remove cookies stored in browser and remove token in database
  const handleLogout = () => {
    fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
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
            }
          })
      })
    removeCookies('token', { path: '/' })
  }

  //Setting the token as a cookie in browser when logging in 
  const handleLogin = (token) => {
    setCookies('token', token, { path: '/' })
  }

  //snack bar related initialize
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  //set the data of the snackbar from the child page
  const openSnackBar = (snackbarData) => {
    setSnackbarData(snackbarData)
  }

  //remove the snackbar when user click the x button
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarData({ open: false })
  };

  return (
    <>
      <CookiesProvider>
        <BrowserRouter>
          <Header cookies={cookies.token} onLogout={handleLogout} sendSnackbar={openSnackBar} />
          <Routes>
            <Route path='/' element={<Home sendSnackbar={openSnackBar} />} />
            <Route path='/search' element={<Search />} />
            <Route path='/register' element={<Register onLogin={handleLogin} sendSnackbar={openSnackBar} />} />
            <Route path='/login' element={<Login onLogin={handleLogin} sendSnackbar={openSnackBar} />} />
            <Route path='/create' element={<CreateEvent sendSnackbar={openSnackBar} />} />
            <Route path='/join/:id' element={<EventJoin />} />
            <Route path='/event/:id' element={<EventView sendSnackbar={openSnackBar} />} />
            <Route path='/edit/:id' element={<EventEdit sendSnackbar={openSnackBar} />} />
            <Route path='/payment' element={<Payment sendSnackbar={openSnackBar} />} />
            <Route path='/my' element={<MyEvents />} />
            <Route path='/profile' element={<Profile sendSnackbar={openSnackBar} onLogin={handleLogin} />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackbarData.open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarData.severity}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
