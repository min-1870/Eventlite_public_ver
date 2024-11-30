import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Grid, Box, Checkbox, Autocomplete, Typography } from '@mui/material'
import { useCookies } from 'react-cookie';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @returns {JXH} JXH code for the eventEdit
 */
function EventEdit({sendSnackbar}) {
  const { id } = useParams()
  const [cookies] = useCookies(['token']);
  const [input, setInput] = useState({ id: [id] });
  const [event, setEvent] = useState({});
  const [tags, setTag] = useState([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const navigate = useNavigate();

  //fetch the list of all the tags and the information about the event
  useEffect(() => {
    fetch('http://localhost:5000/main_page/event_tags_all', {
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
          setTag(data.map(item => item.tag));
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });


    fetch('http://localhost:5000/main_page/event_view?id=' + id, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setEvent(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [cookies.token, id]);

  //store the input from the tag seleciton
  const handleChangeTags = (selected) => {
    setInput({ ...input, tags: selected })
  }

  //store the input from the text field
  const handleChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  //call the endpoint the submit the changed of the event
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(input);
    fetch('http://localhost:5000/main_page/event_edit', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'token': cookies.token
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
              setInput({})
              sendSnackbar({ open: true, message: "Edited successfully!", severity: 'success' })
              navigate('/event/' + id);
            }
          })
      })
  }
  return (
    <>
      {event &&
        <Box sx={{ mt: 20, width: "100%", display: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 500 }}>
            <Grid container direction='column' justify="center" alignItems='center' spacing={10}>
              <Grid item>
                <Typography sx={{ justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Edit the details</Typography>
                <Typography sx={{ color: "#1976d2" }} variant="h6">(Only the specified fields will be updated.)</Typography>
              </Grid>
              <Grid item>
                <form name='Create' onSubmit={handleSubmit}>
                  <Grid container direction='column' spacing={1}>
                    <Grid item>
                      <TextField placeholder={event.event_name} value={input.event_name} sx={{ width: "100%" }} type='text' label='Event name' name='event_name' onChange={handleChange} InputLabelProps={{ shrink: true }}></TextField>
                    </Grid>
                    <Grid item>
                      <TextField placeholder={event.event_description} value={input.event_description} sx={{ width: "100%" }} type='text' label='Event description' name='event_description' onChange={handleChange} InputLabelProps={{ shrink: true }}></TextField>
                    </Grid>
                    <Grid item>
                      <TextField placeholder={event.location} value={input.location} sx={{ width: "100%" }} type='text' label='Location' name='location' onChange={handleChange} InputLabelProps={{ shrink: true }}></TextField>
                    </Grid>
                    <Grid item>
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
                        style={{ width: 500 }}
                        onChange={(event, value) => handleChangeTags(value)}
                        renderInput={(params) => (
                          <TextField {...params} label="Tags" placeholder="Favorites" />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <TextField inputProps={{ min: new Date().toISOString().split('T')[0] }} value={input.event_date} sx={{ width: "100%" }} type='date' label='Event date' name='event_date' InputLabelProps={{ shrink: true }} onChange={handleChange}></TextField>
                    </Grid>
                    <Grid item>
                      <TextField value={input.event_time} sx={{ width: "100%" }} type='time' label='Event time' name='event_time' InputLabelProps={{ shrink: true }} onChange={handleChange}></TextField>
                    </Grid>
                    <Grid item sx={{ mt: 10, mb: 20, justifyContent: "center", display: 'center' }}>
                      <Button required variant='contained' type='submit' >submit</Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Box>
        </Box>
      }
    </>
  );
}

export default EventEdit;