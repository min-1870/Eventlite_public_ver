import { TextField, Checkbox, Autocomplete, Box, Fab } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ButtonGroup from '@mui/material/ButtonGroup';

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information☻
 * @returns {JXH} JXH code for the home page
 */
function Home({sendSnackbar}) {
  const [cookies] = useCookies(['token']);
  const [tags, setTag] = useState([]);
  const [searchDetail, setSearchDetail] = useState({ input: '', sTags: [], sortTime: 'ASC' });
  const [valid, setValid] = useState(true);
  const [events, setEvents] = useState([])

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const navigate = useNavigate();

  //call the endpoint to fetch the list of the all the tags
  useEffect(() => {
    fetch('http://localhost:5000/main_page/event_tags_all', {
      method: 'GET',
      headers: {
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setTag(data.map(item => item.tag));
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  //based on the login status of the user call the different enpoint
  useEffect(() => {
    if (!cookies.token) {
      fetch('http://localhost:5000/main_page/event_all', {
        method: 'GET'
      })
        .then(response => {
          response.json()
            .then(data => {
              if (data.error) {
                sendSnackbar({ open: true, message: data.message, severity: 'error' })
              }
              else {
                setEvents(data)
              }
            })
        })
    } else {
      setValid(false)
      fetch('http://localhost:5000/main_page/event_recommended?preference=explore', {
        method: 'GET',
        headers: {
          'token': cookies.token
        }
      })
        .then(response => {
          response.json()
            .then(data => {
              if (data.message) {
                sendSnackbar({ open: true, message: data.message+' We are listing all the events', severity: 'info' })
                fetch('http://localhost:5000/main_page/event_all', {
                  method: 'GET'
                })
                  .then(response => {
                    response.json()
                      .then(data => {
                        if (data.error) {
                          sendSnackbar({ open: true, message: data.message, severity: 'error' })
                        }
                        else {
                          setEvents(data)
                        }
                      })
                  })
              }
              else {
                setEvents(data)
              }
            })
        })
    }

  }, [cookies])

  //quick access button to event create page
  const createEventButton = () => {
    navigate('/create')
  }

  //store the selected tags from the user
  const handleChangeTags = (selected) => {
    setSearchDetail({ ...searchDetail, sTags: selected });
  }

  //store the selected sort type from the user
  const handleChangeSort = (event) => {
    setSearchDetail({ ...searchDetail, sortTime: event.target.value })
  }

  //when teh user click price button for the preference call the corresponding endpoint
  const handlePreferencePrice = () => {
    fetch('http://localhost:5000/main_page/event_recommended?preference=price', {
      method: 'GET',
      headers: {
        'token': cookies.token
      }
    })
      .then(response => {
        response.json()
          .then(data => {
            if (data.message) {
              sendSnackbar({ open: true, message: data.message+' We are listing all the events', severity: 'info' })
              fetch('http://localhost:5000/main_page/event_all', {
                method: 'GET'
              })
                .then(response => {
                  response.json()
                    .then(data => {
                      if (data.error) {
                        sendSnackbar({ open: true, message: data.message, severity: 'error' })
                      }
                      else {
                        setEvents(data)
                      }
                    })
                })
            }
            else {
              setEvents(data)
            }
          })
      })
  }

  //when teh user click capacity button for the preference call the corresponding endpoint
  const handlePreferenceCapa = () => {
    fetch('http://localhost:5000/main_page/event_recommended?preference=capacity', {
      method: 'GET',
      headers: {
        'token': cookies.token
      }
    })
      .then(response => {
        response.json()
          .then(data => {
            if (data.message) {
              sendSnackbar({ open: true, message: data.message+' We are listing all the events', severity: 'info' })
              fetch('http://localhost:5000/main_page/event_all', {
                method: 'GET'
              })
                .then(response => {
                  response.json()
                    .then(data => {
                      if (data.error) {
                        sendSnackbar({ open: true, message: data.message, severity: 'error' })
                      }
                      else {
                        setEvents(data)
                      }
                    })
                })
            }
            else {
              setEvents(data)
            }
          })
      })
  }

  //when teh user click explore button for the preference call the corresponding endpoint
  const handlePreferenceExplroe = () => {
    fetch('http://localhost:5000/main_page/event_recommended?preference=explore', {
      method: 'GET',
      headers: {
        'token': cookies.token
      }
    })
      .then(response => {
        response.json()
          .then(data => {
            if (data.message) {
              sendSnackbar({ open: true, message: data.message+' We are listing all the events', severity: 'info' })
              fetch('http://localhost:5000/main_page/event_all', {
                method: 'GET'
              })
                .then(response => {
                  response.json()
                    .then(data => {
                      if (data.error) {
                        sendSnackbar({ open: true, message: data.message, severity: 'error' })
                      }
                      else {
                        setEvents(data)
                      }
                    })
                })
            }
            else {
              console.log(data)
              setEvents(data)
            }
          })
      })
  }

  //when the user click search button deliver the search detail into the search page
  const handleSearch = (event) => {
    navigate("/search", { state: { searchDetail: searchDetail } })
  }
  
  return (
    <>
      <Box sx={{ mt: 10, mb: 20, width: "100%", display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 900 }}>
          <Stack spacing={2}>
            <form onSubmit={handleSearch} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid xs={9.9}>
                  <TextField sx={{ width: '100%' }} inputProps={{ style: { fontSize: 20 } }} id="standard-basic" label="What are you looking for?" variant="standard" onChange={e => { setSearchDetail({ ...searchDetail, input: e.target.value }) }} />
                </Grid>
                <Grid xs={0.1}>
                  <Box >
                    <Button sx={{ mt: 1, width: 145, fontSize: 20 }} type="submit" variant="text" onClick={handleSearch}>Search</Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid xs={9.5}>
                <Autocomplete
                  multiple
                  id="eventTags"
                  options={tags}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  style={{ width: '100%' }}
                  onChange={(event, value) => handleChangeTags(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" placeholder="Favorites" />
                  )}
                />
              </Grid>
              <Grid xs={0.5}>
                <Box sx={{ width: 165 }}>
                  <FormControl fullWidth>
                    <InputLabel >Sort by date</InputLabel>
                    <Select
                      value={searchDetail.sortTime}
                      label="sortTime"
                      onChange={handleChangeSort}
                    >
                      <MenuItem value={"ASC"}>Ascending</MenuItem>
                      <MenuItem value={"DES"}>Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            {cookies.token && (
              <Grid container spaceing={2} sx={{ justifyContent: "space-between" }}>
                <Grid item>
                  <Typography sx={{ color: "#1976d2" }} variant="h6">Which preference do you have?</Typography>
                </Grid>
                <Grid item>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button onClick={handlePreferencePrice}>Price</Button>
                    <Button onClick={handlePreferenceCapa}>Capacity</Button>
                    <Button onClick={handlePreferenceExplroe}>Explore</Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            )}

            {events.length === 0 ?
              <Typography sx={{ padding: 10, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h5">Couldn't find any matching event :/</Typography>
              :
              events.map((event) =>
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
          bottom: 40,
          left: 40
        }}
      >
        <Fab color="primary" aria-label="add" onClick={createEventButton} disabled={valid}>
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
}

export default Home;