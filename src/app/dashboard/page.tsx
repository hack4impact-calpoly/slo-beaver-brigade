"use client"
import React from "react";
import { Box, Container, Divider, MenuItem, Select, Typography } from "@material-ui/core";
import Slider from "react-slick";

const dashboard = () => {
  const events = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  return (
    <Container className="app-container">
      <Typography variant="h4" align="center" gutterBottom>
        Your Upcoming Events
      </Typography>
      <Divider className="divider" />
      <Slider {...settings}>
        {events.map(event => (
          <div key={event}>
            <Box className="event-box" textAlign="center">
              <Typography variant="h6">{event}</Typography>
            </Box>
          </div>
        ))}
      </Slider>
      <Typography variant="h5" align="center" gutterBottom>
        Find More Volunteer Events
        <Select
          value={10} // You can set the initial selected value
          onChange={(event) => console.log(event.target.value)} // Handle selection change
        >
          <MenuItem value={10}>At the most right</MenuItem>
        </Select>
      </Typography>
      <Box className="big-rectangular-box" textAlign="center">
        {/* Your content inside the big rectangular box */}
      </Box>
    </Container>
  );
};

export default dashboard;

