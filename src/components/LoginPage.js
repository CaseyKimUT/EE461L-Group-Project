import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export let account_info = {
  "username": "",
  "projects": []
}

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Created by: '}
        <Link color="inherit" href="https://github.com/CaseyKimUT/EE461L-Group-Project">
          EE461L Group 
        </Link>{' '}
        {'.'}
      </Typography>
    );
  }

const theme = createTheme();

export default function LoginPage() {
    // const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")
    const [error, setError]= useState("")
    console.log(localStorage.getItem('userID'))


    let navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        
        console.log({
                  username: formData.get('username'),
                  password: formData.get('password'),
                });
        
        fetch("http://127.0.0.1:5000/check_correct/" + formData.get('username') + "/" + formData.get('password'))
                .then(response => {
                  console.log(response)
                  if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Something went wrong ...')
                    }
                }
                )
                .then(data => {
                  
                  console.log(data)
                  console.log(data.message)
                  if (data.correct) {
                      account_info["username"] = formData.get('username')
                      account_info["projects"] = data.message
                      localStorage.setItem('userID', formData.get('username'))
                      console.log(account_info)
                      console.log("navigating to hwset...")
                      navigate("/hwset")
                  } else {
                      setError(data.message)
                  }
                })
                .catch(e => {
                    console.log(e)
                    // setError(e.message)
                })   
    };
        


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="signup" variant="body2">
                  {"Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      </ThemeProvider>
  );
}