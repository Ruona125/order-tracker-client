import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { userLogin } from "../../Redux/User/userAction";
import Box from "@mui/material/Box";
import "./Login.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../../assets/order.jpg";

import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk"; // Import ThunkDispatch

interface LoginDetails {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [err, setErr] = useState<string>("");
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch(); // Use ThunkDispatch
  const isSignedIn = useSelector((state: any) => state.user.isSignedIn);
  const msg = useSelector((state: any) => state.user.message);
  const isLoading = useSelector((state: any) => state.user.isLoading);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const loginDetails: LoginDetails = {
    email,
    password,
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      return;
    } else {
      dispatch(userLogin(loginDetails)); // Dispatch the async action
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      navigate("/home");
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    setErr(msg);
  }, [setErr, msg]);

  return (
    <div className="container">
      <center>
        <img src={Logo} className="img-logo" alt="Logo" />
      </center>
      <h2 className="login-heading">Login</h2>

      <Box
        component="form"
        sx={{
          "& > :not(style)": {
            m: 1,
            width: "25ch",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "red",
            },
            "&:hover fieldset": {
              borderColor: "red",
            },
            "&.Mui-focused fieldset": {
              borderColor: "red",
            },
          },
          "& .MuiInputLabel-root": {
            color: "red",
          },
        }}
        style={{ display: "grid", marginTop: "23px" }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          InputLabelProps={{ style: { color: "red" } }}
        />
        <br />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "red" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  color="error"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <em>
        <Link to="/forgot/password" className="link-style"> Forgot Password?</Link>
      </em>
      <center>
        {isLoading ? (
          <CircularProgress style={{ color: "red" }} />
        ) : (
          <Button
            type="button"
            variant="contained"
            className="login-button"
            style={{ color: "#fff", backgroundColor: "red", marginTop: "23px" }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        )}
        <br /> <br />
        <p className="msg" style={{color: "red"}}>{err}</p>
      </center>
    </div>
  );
};

export default LoginComponent;
