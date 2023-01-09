import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
      <CssBaseline />
      <App />
  </React.StrictMode>,
  document.getElementById("root")
);
