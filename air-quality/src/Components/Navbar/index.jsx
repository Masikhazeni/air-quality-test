import React from 'react'
import { Box, Typography } from '@mui/material';

export default function Navbar() {
  return (
         <Box
        component={"nav"}
        sx={{
          width: "100%",
          height: "110px",
          position:'fixed',
          zIndex:'2000',
          top:'0',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          background:
            "linear-gradient(107deg,rgba(65, 185, 232, 1) 0%, rgba(67, 129, 196, 1) 52%)",
        }}
      >
           <Typography 
      variant="h1"
      sx={{
        fontSize: { xs: "32px", md: "42px" },
        color: "white",
        textShadow: "1px 1px 2px darkblue",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
          textShadow: "2px 2px 4px rgba(0, 0, 139, 0.5)"
        }
      }}
    >
      Air Quality
    
    </Typography>
    
      </Box>
  )
}
