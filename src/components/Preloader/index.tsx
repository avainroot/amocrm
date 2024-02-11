import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const Preloader = () => (
  <Box
    sx={{
      position: "fixed",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
);
