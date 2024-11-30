import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { TextField, Checkbox, Autocomplete, Box, Fab } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
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

/**
 * 
 * @returns {JXH} JXH code for the search
 */
function Search() {
  const location = useLocation();
  const [cookies] = useCookies(['token']);
  const [events, setEvents] = useState([])
  const [tags, setTag] = useState([]);
  const [searchDetail, setSearchDetail] = useState({ input: '', sTags: [], sortTime: 'ASC' });
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  //Validation of the create event button
  useEffect(() => {
    if (cookies.token) setValid(false)
  }, [cookies])

  //Search detail from the home page
  useEffect(() => {
    // setSearchDetail(location.state.searchDetail)  
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

    if (location.state) {
      const searchDetailH = location.state.searchDetail
      fetch('http://localhost:5000/search?search=' + searchDetailH.input + '&tags=' + searchDetailH.sTags.toString() + '&sortTime=' + searchDetailH.sortTime, {
        method: 'GET'
      })
        .then(response => {
          response.json()
            .then(data => {
              if (data.error) {
                setEvents([])
              }
              else {
                setEvents(data)
                setSearchDetail({ input: [searchDetailH.input], sTags: [], sortTime: 'ASC' })
              }
            })
        })
    }
    // if (!Object.values(searchDetail).includes(undefined)) handleSearch()
  }, [location]);

  //Search detail from the search page
  const handleSearchDetail = (event) => {
    setSearchDetail({ ...searchDetail, input: event.target.value })
  }

  //button link to create
  const createEventButton = () => {
    navigate('/create')
  }

  //filtering by tags
  const handleChangeTags = (selected) => {
    setSearchDetail({ ...searchDetail, sTags: selected });
  }

  //store the sortype from the user input
  const handleChangeSort = (event) => {
    setSearchDetail({ ...searchDetail, sortTime: event.target.value })
  }

  //search endpoint to fetch the list of event based on the search detail
  const handleSearch = (event) => {

    event.preventDefault()
    fetch('http://localhost:5000/search?search=' + searchDetail.input + '&tags=' + searchDetail.sTags.toString() + '&sortTime=' + searchDetail.sortTime, {
      method: 'GET'
    })
      .then(response => {
        response.json()
          .then(data => {
            if (data.error) {
              setEvents([])
            }
            else {
              setEvents(data)
            }
          })
      })
  }

  return (
    <>
      <Box sx={{ mt: 10, mb: 20, width: "100%", display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 900 }}>
          <Stack spacing={2}>
            <form onSubmit={handleSearch} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid xs={9.9}>
                  <TextField sx={{ width: '100%' }} value={searchDetail.input} inputProps={{ style: { fontSize: 20 } }} id="standard-basic" label="What are you looking for?" variant="standard" onChange={handleSearchDetail} />
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
                      label="sortTime"
                      value={searchDetail.sortTime}
                      onChange={handleChangeSort}
                    >
                      <MenuItem value={"ASC"}>Ascending</MenuItem>
                      <MenuItem value={"DES"}>Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

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
                    <Typography align="justify" variant="body2">
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

export default Search;