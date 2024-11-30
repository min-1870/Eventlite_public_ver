import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Rating from '@mui/material/Rating';
import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Typography, Box } from '@mui/material'
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * 
 * @param {function} sendSnackbar deliver snackbar information
 * @returns {JXH} JXH code for the eventView
 */
function EventView({ sendSnackbar }) {
  const { id } = useParams()
  const [cookies] = useCookies(['token']);
  const [event, setEvent] = useState(undefined);
  const [host, setHost] = useState(false);
  const [join, setJoin] = useState(false);
  const [student, setStudent] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [replies, setReplies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [score, setScore] = useState(0);
  const [reviewR, setReviewR] = useState('');
  const [scoreR, setScoreR] = useState(0);
  const [repliesR, setRepliesR] = useState({});
  const [subscribed, setSubscribed] = useState(false);
  const [validReview, setValidReview] = useState(true);
  const [validCancel, setValidCancel] = useState(true);
  const navigate = useNavigate();

  //fetch the information of the event by endpoint
  useEffect(() => {
    fetch('http://localhost:5000/main_page/event_view?id=' + id, {
      method: 'GET',
      headers: {
        'token': cookies.token,
      },
    })
      .then(response => {
        response.json()
          .then(eventData => {
            if (eventData.error) {
              alert("event_view:" + eventData.error)
            }
            else {
              setEvent(eventData)
              //get the score of the event by endpoint
              fetch(`http://localhost:5000/review/average_star_rating?eventId=` + id, { 
                method: 'GET'
              })
                .then((response) => response.json())
                .then((scoreData) => {
                  if (scoreData.error) {
                    alert("average_star_rating:" + scoreData.error)
                  } else {
                    setScore(scoreData.score)
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });

              //get the list of replies for the event
              fetch(`http://localhost:5000/review/list_replies?eventId=` + id, { 
                method: 'GET'
              })
                .then((response) => response.json())
                .then((repliesData) => {
                  if (repliesData.error) {
                    alert("list_replies:" + repliesData.error)
                  } else {
                    let grouped = repliesData.replies.reduce((obj, item) => {
                      if (!obj[item.reviewId]) {
                        obj[Number(item.reviewId)] = [];
                      }
                      obj[item.reviewId].push(item);
                      return obj;
                    }, {});

                    setReplies(grouped)
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });

              //get the list of notification for the event
              fetch(`http://localhost:5000/main_page/list/notifications?eventId=` + id, { 
                method: 'GET'
              })
                .then((response) => response.json())
                .then((notificationsData) => {
                  if (notificationsData.error) {
                    alert("list noti:" + notificationsData.error)
                  } else {
                    setNotifications(notificationsData.notifications)
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });

              //get the list of review for the event
              fetch(`http://localhost:5000/review/list_review?eventId=` + id, { 
                method: 'GET'
              })
                .then((response) => response.json())
                .then((reviewsData) => {
                  if (reviewsData.error) {
                    alert("list_review:" + reviewsData.error)
                  } else {
                    setReviews(reviewsData.reviews)
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });

              if (cookies.token) { // if the user is logged in get the profile info by endpoint
                fetch(`http://localhost:5000/auth/user/profile`, {
                  method: 'GET',
                  headers: {
                    'token': cookies.token,
                  },
                })
                  .then((response) => response.json())
                  .then((userData) => {
                    if (userData.error) {
                      alert("profile:" + userData.error)
                    } else {
                      if (userData.eventsJoined.includes(eventData.id)) { setJoin(true); };
                      if (userData.eventsHosted.includes(eventData.id)) { setHost(true); };
                      if (userData.student === true) { setStudent(true); };
                      if (eventData.subscribed_users.map(ele => Number(ele)).includes(Number(userData.id))) { setSubscribed(true) }
                    }
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                  });
              }

            }
          })
      })

  }, [cookies, id])

  //validate the submit buttom based on the input for the review
  useEffect(() => {
    if (reviewR.length > 0) {
      if (scoreR !== 0) {
        setValidReview(false)
      }
    } else {
      setValidReview(true)
    }
  }, [reviewR, scoreR])

  //check whether the event date is more the 7 days left to enable the cancel button for the host
  useEffect(() => {
    const isMoreThan7Days = (eventDate) => {
      const currentDate = new Date();
      const eventDateObject = new Date(eventDate);
      const differenceInMilliseconds = eventDateObject - currentDate;
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      return differenceInDays >= 7;
    }
    event && setValidCancel(!isMoreThan7Days(event.event_date))
  }, [event])


  //call the endpoint whe the user clicked the like button
  const submitSubscribe = () => {
    fetch(`http://localhost:5000/main_page/event_subscribe`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'token': cookies.token,
      },
      body: JSON.stringify({ id: id })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          sendSnackbar({ open: true, message: data.error, severity: 'error' })
        } else {
          sendSnackbar({ open: true, message: "Subscribed successfully!", severity: 'success' })
          setSubscribed(true)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  //call the delete event endpoint
  const deleteEvent = () => {
    fetch(`http://localhost:5000/main_page/event_delete`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'token': cookies.token,
      },
      body: JSON.stringify({ id: id })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          sendSnackbar({ open: true, message: data.error, severity: 'error' })
        } else {
          sendSnackbar({ open: true, message: "Deleted successfully!", severity: 'success' })
          navigate('/')
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  //call the refund endpoint
  const refundEvent = () => {
    fetch(`http://localhost:5000/main_page/user/cancel_event`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'token': cookies.token,
      },
      body: JSON.stringify({ eventId: id })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          sendSnackbar({ open: true, message: data.error, severity: 'error' })
        } else {
          sendSnackbar({ open: true, message: '$' + Math.round(data.sumOfRefund) + " refunded successfully!", severity: 'success' })
          // setJoin(false)
          // setEvent()
          setTimeout(() => {
            window.location.reload()
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  //differentbutton combination for the user
  const buttonJXH = () => {
    let button
    if (Object.keys(cookies).length !== 0) {
      if (host) {
        //for the user who is the host of the event
        button =
          <Grid container >
            <Grid item>
              <Button sx={{ width: 130, height: 70, mr: 1 }} onClick={() => navigate('/edit/' + id)} variant='contained'>Edit</Button>
            </Grid>
            <Grid item>
              <Button disabled={validCancel} onClick={() => deleteEvent()} sx={{ width: 130, height: 70, mr: 5 }} variant='contained'>{validCancel ? "Cannot Cancel" : "Cancel"}</Button>
            </Grid>
          </Grid>;
      } else if (join) {
        //for the user who is joined the event
        button =
          <Grid container >
            <Grid item>
              <Button disabled={subscribed} onClick={submitSubscribe} sx={{ width: 130, height: 70, mr: 1 }} variant='contained'>Like</Button>
            </Grid>
            <Grid item>
              <Button sx={{ width: 130, height: 70, mr: 5 }} onClick={() => refundEvent()} variant='contained'>Refund</Button>
            </Grid>
          </Grid>;
      } else {
        //for the user who is not yet joined the event
        button =
          <Grid container >
            <Grid item>
              <Button disabled={subscribed} onClick={submitSubscribe} sx={{ width: 130, height: 70, mr: 1 }} variant='contained'>Like</Button>
            </Grid>
            <Grid item>
              <Button sx={{ width: 130, height: 70, mr: 5 }} disabled={event.max_capacity === event.current_capacity} onClick={() => navigate('/join/' + id)} variant='contained'>Join</Button>
            </Grid>
          </Grid>;
      }
    } else {
      //for the user doesn't loggin yet
      button =
        <Grid container >
          <Grid item>
            <Button disabled={true} sx={{ width: 261, height: 70, mr: 5 }} variant='contained'>Login to join the event</Button>
          </Grid>
        </Grid>;
    }

    return (
      <Grid item>
        {button}
      </Grid>
    );
  }

  //review section only for the user who join the event
  function writeJXH() {
    let write

    function handelReview(input) {
      setReviewR(input.target.value)
    }

    function handelScore(input) {
      setScoreR(Number(input.target.defaultValue))
    }

    function handleSubmitReview() {
      fetch(`http://localhost:5000/review/create`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'token': cookies.token,
        },
        body: JSON.stringify({ eventId: id, review: reviewR, star_rating: scoreR })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            sendSnackbar({ open: true, message: data.error, severity: 'error' })
          } else {
            window.location.reload()
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    if (Object.values(cookies).length !== 0 && join) {
      write =
        <Grid container sx={{ flexDirection: 'column' }}>
          <Rating onChange={handelScore} sx={{ mb: 0, mt: 5, ml: 5, mr: 5 }} size="large" />
          <TextField onChange={handelReview} placeholder='Write your review' label='Review' sx={{ mb: 2, mt: 2, ml: 5, mr: 5 }} multiline maxRows={4} />
          <Grid container sx={{ justifyContent: 'flex-end' }}>
            <Button disabled={validReview} onClick={handleSubmitReview} sx={{ width: 90, height: 40, mr: 5, mb: 5 }} variant='contained'>Submit</Button>
          </Grid>
          <Divider flexItem></Divider>
        </Grid>
    }
    return (
      <>
        {write}
      </>
    )
  }

  //save the reply of the review
  function handleReply(input, reviewId) {
    setRepliesR({ ...repliesR, [reviewId]: input.target.value })
  }

  //submit the reply and call the endpoint
  function submitReply(reviewId) {
    console.log({ eventId: id, reviewId: reviewId, reply: repliesR[reviewId] })
    fetch(`http://localhost:5000/review/reply`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'token': cookies.token,
      },
      body: JSON.stringify({ eventId: id, reviewId: reviewId, reply: repliesR[reviewId] })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("review/reply:" + data.error)
        } else {
          window.location.reload()
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <>{event !== undefined &&
      <Box sx={{ width: "100%" }}>
        <Grid container sx={{ overflow: 'hidden' }}>
          <Grid item xs={9}>
            <Grid container sx={{ flexDirection: 'column', justifyContent: "flex-start" }}>
              <Grid item >
                <Grid container sx={{ justifyContent: "space-between", alignItems: 'center' }}>
                  <Grid item>
                    <Typography sx={{ ml: 5, mb: 5, mt: 5, justifyContent: "center", display: 'center', color: "#1976d2" }} variant="h3">{event.event_name}</Typography>
                  </Grid>
                  {buttonJXH()}
                </Grid>
              </Grid>
              <Divider flexItem></Divider>
              <Grid item>
                <Typography sx={{ mb: 2, mt: 2, ml: 5, color: "#1360ab" }} variant="h5">
                  {Object.values(event.price).length === 1 ?
                    Number(Object.values(event.price)) === 0 ?
                      'Free'
                      :
                      student && !host ? 'Only $' + Math.round(Object.values(event.price) * 0.85) + " (15% student discout applied)" : 'Only $' + Object.values(event.price)
                    :
                    student && !host ? 'From $' + Math.round(Math.min(...Object.values(event.price)) * 0.85) + ' to $' + Math.round(Math.max(...Object.values(event.price)) * 0.85) + " (15% student discout applied)" : 'From $' + Math.min(...Object.values(event.price)) + ' to $' + Math.max(...Object.values(event.price))
                  }
                </Typography>
              </Grid>
              <Divider flexItem></Divider>
              <Grid item>
                <Typography align="justify" sx={{ mb: 5, mt: 5, ml: 5, mr: 5, color: "#0d4377" }} variant="h6">{event.event_description}</Typography>
              </Grid>
              <Divider flexItem></Divider>
              {writeJXH()}
              <Grid item>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid item>
                    <Typography align="justify" sx={{ mb: 5, mt: 5, ml: 5, mr: 5, color: "#1360ab" }} variant="h4">{Math.round(score)}/5</Typography>
                  </Grid>
                  <Grid item>
                    <Rating size="large" value={score} readOnly />
                  </Grid>
                </Grid>
              </Grid>
              <Divider flexItem></Divider>
              <Grid item sx={{ padding: 5 }}>
                {reviews.length !== 0 &&
                  reviews.map((review) =>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Grid container sx={{ padding: 5, flexDirection: 'column', justifyContent: "flex-start" }}>
                          <Grid item>
                            <Grid container sx={{ alignItems: 'center' }}>
                              <Typography align="justify" sx={{ mr: 1, color: "#1360ab" }} variant="h6">{review.username ? review.username : 'Unknown'}</Typography>
                              <Rating size="medium" value={Number(review.star)} readOnly />
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Typography align="justify" sx={{ color: "#0d4377" }} variant="h5">{review.review}</Typography>
                          </Grid>
                          <Grid item>
                            {replies.length !== 0 && replies[Number(review.id)] && replies[Number(review.id)].map((reply) =>
                              <Card sx={{ mt: 2 }}>
                                <CardContent>
                                  <Grid container sx={{ padding: 1, flexDirection: 'column', justifyContent: "flex-start" }}>
                                    <Grid item>
                                      <Grid container sx={{ alignItems: 'center' }}>
                                        <Typography align="justify" sx={{ mr: 1, color: "#1360ab" }} variant="h6">{reply.username} : </Typography>
                                        <Typography align="justify" sx={{ color: "#0d4377" }} variant="h5">{reply.reply}</Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            )}
                          </Grid>
                          {(host || join) &&
                            <Grid item>
                              <Grid container sx={{ flexDirection: 'column' }}>
                                <TextField onChange={e => handleReply(e, review.id)} placeholder='Write your reply' label='Reply' sx={{ mt: 2, mb: 2 }} multiline maxRows={4} />
                                <Grid container sx={{ justifyContent: 'flex-end' }}>
                                  <Button onClick={() => submitReply(review.id)} sx={{ width: 90, height: 40, }} variant='contained'>Submit</Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          }
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
              </Grid>
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem></Divider>
          <Grid item xs={2.99}>
            <Grid container sx={{ flexDirection: 'column', justifyContent: "flex-start" }}>
              <Grid item>
                <Typography sx={{ mb: 0, mt: 5, ml: 5, mr: 5, color: "#1360ab" }} variant="h5">Available seats: </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 5, mt: 3, ml: 5, mr: 5, color: "#0d4377" }} variant="h6">{event.max_capacity - event.current_capacity} out of {event.max_capacity}</Typography>
              </Grid>
              <Grid item >
                <Divider style={{ width: '100%' }} />
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 0, mt: 5, ml: 5, mr: 5, color: "#1360ab" }} variant="h5">Address: </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 0, mt: 3, ml: 5, mr: 5, color: "#0d4377" }} variant="h6"><Link href={"https://www.google.com/maps/search/" + event.location} target="_blank">{event.location}</Link></Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 5, mt: 0, ml: 5, mr: 5, color: "#0d4377" }} variant="body1">(Click the address)</Typography>
              </Grid>
              <Grid item >
                <Divider style={{ width: '100%' }} />
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 0, mt: 5, ml: 5, mr: 5, color: "#1360ab" }} variant="h5">Date & Time: </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 5, mt: 3, ml: 5, mr: 5, color: "#0d4377" }} variant="h6">{event.event_date} / {event.event_time}</Typography>
              </Grid>
              <Grid item >
                <Divider style={{ width: '100%' }} />
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 0, mt: 5, ml: 5, mr: 5, color: "#1360ab" }} variant="h5">Requirements: </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 5, mt: 3, ml: 5, mr: 5, color: "#0d4377" }} variant="h6">Minimum age: {event.age_restriction}</Typography>
              </Grid>
              <Grid item >
                <Divider style={{ width: '100%' }} />
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 0, mt: 5, ml: 5, mr: 5, color: "#1360ab" }} variant="h5">Tags: </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 5, mt: 3, ml: 5, mr: 5, color: "#0d4377" }} variant="h6">{Object.values(event.tags).toString()}</Typography>
              </Grid>
              <Grid item >
                <Divider style={{ width: '100%' }} />
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 0, mt: 5, ml: 5, mr: 5, color: "#1360ab" }} variant="h5">Notifications: </Typography>
              </Grid>
              <Grid item sx={{ margin: 5 }}>
                {notifications.length !== 0 &&
                  notifications.map((notification) =>
                    <Card sx={{ width: "100%", mb: 3 }}>
                      <CardContent>
                        <Typography align="justify" sx={{ color: "#0d4377" }} variant="h6">{notification.notification}</Typography>
                      </CardContent>
                    </Card>
                  )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    }
    </>
  );

}

export default EventView;