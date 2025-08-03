import { Box, Typography } from "@mui/material";
import React from "react";

export default function ApiQualityApp() {
  return (
    <Box>
      <Box
        component={"nav"}
        sx={{
          width: "100%",
          height: "110px",
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          background:
            "linear-gradient(107deg,rgba(65, 185, 232, 1) 0%, rgba(75, 131, 191, 1) 57%)",
        }}
      >
        <Typography
          component={"h1"}
          sx={{
            fontSize: "48px",
            fontWeight:'600',
            color: "white",
            textShadow: "1px 1px 2px darkblue",
             transition: "all 0.5s",
            "&:hover": {
              transform: "scale(1.1)",
             
            },
          }}

        >
          Air Quality
        </Typography>
      </Box>
    </Box>
  );
}
