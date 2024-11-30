import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @param {function} cookies token in the cookies
 * @param {function} onLogout deliver user detail information 
 * @returns {JXH} JXH code for the header
 */
function Header({ cookies, onLogout, sendSnackbar }) {
  const navigate = useNavigate();
  const location = useLocation();

  //when user click logout button saved the call the logout endpoint
  const handleLogoutClick = () => {
    onLogout();
    sendSnackbar({ open: true, message: "Logged out successfully!", severity: 'success' })
    setTimeout(() => { location.pathname === '/' ? window.location.reload() : navigate('/') }, 1000);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Grid container>
            <Link style={{ textDecoration: 'none', color: 'white', marginRight: 50 }} to='/'><Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Main Page
            </Typography></Link>
            {cookies &&
              <Link style={{ textDecoration: 'none', color: 'white' }} to='/my'><Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                My Events
              </Typography></Link>
            }
          </Grid>
          <Grid container>
            {cookies
              ? <>
                <Link style={{ textDecoration: 'none', color: 'white', marginRight: 50 }} to='/profile'><Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                  Profile
                </Typography></Link>
                <Link style={{ textDecoration: 'none', color: 'white' }} onClick={handleLogoutClick} to='/'><Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                  Logout
                </Typography></Link>
              </>
              : <>
                <Link style={{ textDecoration: 'none', color: 'white', marginRight: 50 }} to='/register'><Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                  Register
                </Typography></Link>
                <Link style={{ textDecoration: 'none', color: 'white' }} to='/login'><Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}

                >
                  Login
                </Typography></Link>
              </>
            }
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Header;