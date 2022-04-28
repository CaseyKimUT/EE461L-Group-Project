import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material";
// import { Route, useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2"
    }
  }
});

export default function ButtonAppBar() {
  // let navigate = useNavigate();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
          <AppBar position="static">
            <Toolbar>
              <Button 
                color="inherit"
                href="/hwset"
                // onClick={() => {
                //   navigate("/hwset");
                // }}
              > Projects </Button>

              <Button 
                color="inherit"
                href="/datasets"
                // onClick={() => {
                //   navigate("/datasets");
                // }}
              >DataSets</Button>
              <Typography
                variant="h6"
                component="div"
                align="center"
                sx={{ flexGrow: 1}}
              >
                Our site
              </Typography>
              
              <Box color="inherit"></Box>
              <Button 
                color="inherit"
                href="/"
                onClick={() => {
                  localStorage.setItem('userID', '')
                  
                }}
                >Logout</Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </Box>
    </>
  );
}
