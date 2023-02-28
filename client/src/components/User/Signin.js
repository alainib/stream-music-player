import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Box, Paper, Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import {sigin} from "../../services/auth";

const classes = {
  container: {
    zIndex: 2,
    position: "relative",
    display: 'flex',
    height: "98vh",
    width: "98vw",
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
  },
  displayColumn: {
    display: 'flex',
    flexDirection: 'column',
    padding: 3,
  }
}

export function Signin() {



  const [login, setLogin] = useState("alain");
  const [password, setPassword] = useState("alain");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeLogin = (e) => {
    setLogin(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {

    e.preventDefault();

    setMessage("");
    setLoading(true);

    sigin({login, password}).then(
      () => {
        //navigate("/");
        window.location.reload();
      },
      (error) => {
        console.log(error)
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <Box sx={classes.container} id="Login">
      <Box sx={classes.center} id="Logincenter">
        <Paper elevation={3} sx={classes.displayColumn}>

          <TextField value={login} onChange={onChangeLogin} label="Login" variant="outlined" margin="dense" />
          <TextField value={password} onChange={onChangePassword} label="Password" variant="outlined" margin="dense" />
          <Button onClick={handleLogin}>
            Connexion
          </Button>
          {message}
        </Paper>
      </Box>
    </Box>
  );
};
