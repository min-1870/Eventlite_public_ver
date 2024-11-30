import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { Box, Fab } from '@mui/material'
import { useCookies } from 'react-cookie';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

/**
 * 
 * @returns {JXH} JXH code for the myevent
 */
function MyEvents() {
  const [cookies] = useCookies(['token']);
  const [eventsH, setEventsH] = useState([])
  const [eventsJ, setEventsJ] = useState([])
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();

  //Validation of the create event button and fetch the list of user joined and hosted events by calling endpoint
  useEffect(() => {
    if (cookies.token) setValid(false)
    fetch('http://localhost:5000/auth/listEventsJoined', {
      method: 'GET',
      headers: {
        'token': cookies.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setEventsJ(data)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    fetch('http://localhost:5000/auth/listEventsHosted', {
      method: 'GET',
      headers: {
        'token': cookies.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setEventsH(data)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [cookies])

  //button link to create
  const createEventButton = () => {
    navigate('/create')
  }

  return (
    <>
      <Box sx={{ mt: 10, mb: 20, width: "100%", display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 900 }}>
          <Stack spacing={2}>
            <Typography sx={{ color: "#1976d2" }} variant="h4">Events Joined</Typography>
            {eventsJ.length === 0 ?
              <Typography sx={{ padding: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h5">You are not joining any event :/</Typography>
              :
              eventsJ.map((event) =>
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <Grid container sx={{ justifyContent: "space-between" }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="h5" component="div">
                          {event.event_name}
                        </Typography>
                        <Typography variant="body1" component="div">
                          start from ${Math.min(...Object.values(event.price))}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" component="div">
                          (Joined/Max)
                        </Typography>
                        <Typography variant="h5" component="div">
                          {event.current_capacity}/{event.max_capacity}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" component="div">
                          (Age restirction)
                        </Typography>
                        <Typography variant="h5" component="div">
                          {event.age_restriction}
                        </Typography>
                      </Box>
                    </Grid>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {event.tags.toString()}
                    </Typography>
                    <Typography align='justify' variant="body2">
                      {`${event.event_description.substring(0, 400)}...`}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", ml: 1 }}>
                    <Typography variant="body2">
                      {event.event_date}
                    </Typography>
                    <Button sx={{ mr: 1 }} size="small" onClick={() => navigate(`/event/${event.id}`)} >Learn More</Button>
                  </CardActions>
                </Card>
              )}
          </Stack>
          <Stack spacing={2} sx={{ mt: 10 }}>
            <Typography sx={{ color: "#1976d2" }} variant="h4">Events Hosted</Typography>
            {eventsH.length === 0 ?
              <Typography sx={{ padding: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h5">You are not hosting any event :/</Typography>
              :
              eventsH.map((event) =>
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <Grid container sx={{ justifyContent: "space-between" }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="h5" component="div">
                          {event.event_name}
                        </Typography>
                        <Typography variant="body1" component="div">
                          start from ${Math.min(...Object.values(event.price))}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" component="div">
                          (Joined/Max)
                        </Typography>
                        <Typography variant="h5" component="div">
                          {event.current_capacity}/{event.max_capacity}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" component="div">
                          (Age restriction)
                        </Typography>
                        <Typography variant="h5" component="div">
                          {event.age_restriction}
                        </Typography>
                      </Box>
                    </Grid>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {event.tags.toString()}
                    </Typography>
                    <Typography align='justify' variant="body2">
                      {`${event.event_description.substring(0, 400)}...`}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", ml: 1 }}>
                    <Typography variant="body2">
                      {event.event_date}
                    </Typography>
                    <Button sx={{ mr: 1 }} size="small" onClick={() => navigate(`/event/${event.id}`)} >Learn More</Button>
                  </CardActions>
                </Card>
              )}
          </Stack>
        </Box>
      </Box>


      <Box
        sx={{
          '& > :not(style)': { m: 1 },
          position: 'fixed',
          bottom: 16,
          left: 16
        }}
      >
        <Fab color="primary" aria-label="add" onClick={createEventButton} disabled={valid}>
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
}

export default MyEvents;