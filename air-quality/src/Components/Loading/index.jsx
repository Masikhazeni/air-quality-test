import { Box } from "@mui/material";
import React from "react";
import { FadeLoader } from "react-spinners";

export default function Loading() {
  return (
    <Box
      className="flex items-center justify-center fixed 
    top-0 left-0 right-0 bottom-0 backdrop-blur	 bg-white-100"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: "0",
        left: "0",
        right:'0',
        bottom:'0',
        background:'blur',
        backgroundColor:'white'
      }}
    >
      <FadeLoader size={80} color="green" />
    </Box>
  );
}
