import React from "react";
import {Container, Typography} from "@mui/material";

export default function Home() {
  return (
    <Container
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <Typography variant="h3" align="center">
        <b>ETH Portfolio</b>
      </Typography>
      <Typography variant="h6" align="center">
          <br/>
          View your Ethereum tokens portfolio by logging with Unstoppable Domains or enter the address manually.
      </Typography>
      <Typography variant="h6" align="center">
          <br/>
        <b>Login now using the button from navbar</b>
      </Typography>
    </Container>
  );
}
