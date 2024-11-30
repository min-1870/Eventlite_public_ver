import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import { Button, Grid, Box, Typography } from '@mui/material'

/**
 * 
 * @returns {JXH} JXH code for the event join
 */
function EventJoin() {
  const { id } = useParams();
  const [cookies] = useCookies(['token']);
  const [input, setInput] = useState({ id: id, selectedSeats: [], price: 0 });
  const [seats, setSeats] = useState([]);
  const [valid, setValid] = useState(true);
  const [multiplier, setMultiplier] = useState(1)

  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'Location', width: 180 },
    { field: 'price', headerName: 'Price', width: 180 },
    { field: 'status', headerName: 'Status', width: 180 }
  ];

  //store the selection of the seat from the user
  const handleSelectionChange = (newSelection) => {
    let price = 0
    for (let i = 0; i < seats.length; i++) {
      if (newSelection.includes(Number(seats[i].id))) price += Number(seats[i].price);
    };
    setInput({ id: id, selectedSeats: newSelection, price: price });
  }

  //validate the button
  useEffect(() => {
    const validation = () => {
      if (input.selectedSeats !== undefined) {
        if (input.selectedSeats.length !== 0) return false;
      }
      return true
    }
    setValid(validation());
  }, [input]);

  useEffect(() => {

    fetch(`http://localhost:5000/auth/user/profile`, {
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
          console.log(data.student)
          data.student ? setMultiplier(0.85) : setMultiplier(1)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    //fetch the seat information by the endpoint
    fetch(`http://localhost:5000/main_page/event_seats_all?id=${id}`, {
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
          const updatedData = data.map(seat => ({ ...seat, price: Math.round(seat.price * multiplier) }));
          setSeats(updatedData);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [cookies.token, id, multiplier]);

  //link the the payment page with the information of the seats and price
  const handleSubmit = (event) => {
    navigate("/payment", { state: { input: input } });
  }

  return (

    <>
      <Box sx={{ mt: 20, width: "100%", display: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 500 }}>
          <Grid container direction='column' spacing={10} justify="center" alignItems='center'>
            <Grid item>
              <Typography sx={{ mb: 1, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">Select the seats</Typography>
            </Grid>
            <Grid item>
              {multiplier === 0.85 && <Typography sx={{ color: "#1976d2" }} variant="body1">15% student discout applied</Typography>}
              <div style={{ height: 500, width: 600 }}>
                <DataGrid
                  rows={seats}
                  columns={columns}
                  isRowSelectable={(params) => (params.row.status === "Available")}
                  onRowSelectionModelChange={handleSelectionChange}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[10, 20]}
                  checkboxSelection
                />
              </div>
            </Grid>
            <Grid item sx={{ mt: 10, mb: 20, justifyContent: "center", display: 'center' }}>
              <Button variant='contained' onClick={handleSubmit} disabled={valid}>NEXT</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default EventJoin;