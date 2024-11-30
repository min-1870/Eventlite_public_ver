import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, Checkbox, Autocomplete, Typography } from '@mui/material'
import { useCookies } from 'react-cookie';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @returns {JXH} JXH code for the createEvent
 */
function CreateEvent({sendSnackbar}) {
  const [cookies] = useCookies(['token']);
  const [input, setInput] = useState({ age_restriction: undefined, event_name: undefined, event_description: undefined, price: [], location: undefined, tags: [], event_date: undefined, event_time: undefined, max_capacity: undefined });
  const [tags, setTag] = useState([]);
  const [fields, setFields] = useState([{ value: null }]);
  const [valid, setValid] = useState(true);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const navigate = useNavigate();

  //validate the input from the text field and the tags to validate the button
  useEffect(() => {
    const validation = () => {
      if (!Object.values(input).includes(undefined)) {
        if ((input['price'] && input['price'].length !== 0) || (input['tags'] && input['tags'].length !== 0)) {
            if ((input['age_restriction'] !== undefined) && input['age_restriction'] !== '') {
              if (Number(input['age_restriction']) >= 0 && Number(input['max_capacity'] > 0)) {
                return false
              }
            }
        }
      }
      return true
    }
    setValid(validation());
  }, [input]);

  //store the prices from the textfield
  const handleChangePrice = (i, event) => {
    let values = [...fields];
    values[i].value = event.target.value;
    setFields(values);
    values = values.filter(item => item.value !== null);
    setInput({ ...input, price: values.map(item => item.value) });
  }

  //add a textfield when user click the add button
  const handleAdd = () => {
    const values = [...fields];
    values.push({ value: null });
    setFields(values);
  }

  //remove the textfield when user click the remove button
  const handleRemove = (i) => {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
    setInput({ ...input, price: values.map(item => item.value) });
  }

  //fetch all of the tags from the db
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
  }, [cookies.token]);

  //store the user input from the tag selection
  const handleChangeTags = (selected) => {
    setInput({ ...input, tags: selected })
  }

  //store the user input from the text field
  const handleChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  //submit the event detail when user click the button
  const handleSubmit = (event) => {
    event.preventDefault()
    fetch('http://localhost:5000/main_page/event_create', {
      method: 'POST',
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
              event.target.reset()
              sendSnackbar({ open: true, message: "Created successfully!", severity: 'success' })
              navigate('/')
            }
          })
      })
  }
  
  return (
    <>
      <Box sx={{ mt: 20, width: "100%", display: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 500 }}>
          <Grid container direction='column' justify="center" alignItems='center' spacing={10}>
            <Grid item>
              <Typography sx={{ justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Input the details</Typography>
            </Grid>
            <Grid item>
              <form name='Create' onSubmit={handleSubmit}>
                <Grid container direction='column' spacing={1}>
                  <Grid item>
                    <TextField sx={{ width: "100%" }} required type='text' label='Event name' name='event_name' onChange={handleChange}></TextField>
                  </Grid>
                  <Grid item>
                    <TextField sx={{ width: "100%" }} required type='text' label='Event description' name='event_description' onChange={handleChange}></TextField>
                  </Grid>
                  <Grid item>
                    <Box>
                      {fields.map((field, idx) => {
                        if (fields.length === 1) {
                          return (
                            <Box key={`${field}-${idx}`}>
                              <TextField
                                sx={{ width: "82%" }}
                                required
                                type='number'
                                label="Price"
                                value={field.value}
                                onChange={e => handleChangePrice(idx, e)}
                              />
                            </Box>
                          )
                        } else {
                          return (
                            <Box key={`${field}-${idx}`}>
                              <TextField
                                sx={{ width: "82%" }}
                                type='number'
                                label={`Price (${idx + 1})`}
                                value={field.value}
                                onChange={e => handleChangePrice(idx, e)}
                              />
                              <Button onClick={() => handleRemove(idx)}>Remove</Button>
                            </Box>
                          )
                        }
                      })}
                      <Button onClick={() => handleAdd()}>Add</Button>
                    </Box>
                  </Grid>
                  <Grid item>
                    <TextField sx={{ width: "100%" }} required type='text' label='Location' name='location' onChange={handleChange}></TextField>
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
                    <TextField inputProps={{ min: new Date().toISOString().split('T')[0] }} sx={{ width: "100%" }} required type='date' label='Event date' name='event_date' InputLabelProps={{ shrink: true }} onChange={handleChange}></TextField>
                  </Grid>
                  <Grid item>
                    <TextField sx={{ width: "100%" }} required type='time' label='Event time' name='event_time' InputLabelProps={{ shrink: true }} onChange={handleChange}></TextField>
                  </Grid>
                  <Grid item>
                    <TextField sx={{ width: "100%" }} required type='number' label='Max capacity' name='max_capacity' onChange={handleChange} inputProps={{ min: 1 }}></TextField>
                  </Grid>
                  <Grid item>
                    <TextField sx={{ width: "100%" }} required type='number' label='Age restriction' name='age_restriction' onChange={handleChange}></TextField>
                  </Grid>
                  <Grid item sx={{ mt: 10, mb: 20, justifyContent: "center", display: 'center' }}>
                    <Button required variant='contained' type='submit' disabled={valid}>Create</Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>

    </>
  );
}

export default CreateEvent;