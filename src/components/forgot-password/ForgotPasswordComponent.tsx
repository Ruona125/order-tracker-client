import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, MenuItem, IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/order.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Box from "@mui/material/Box";
interface ForgotPasswordDetails {
  email: string | null;
  confirm_password: string | null;
  password: string | null;
  security_question: string;
  security_answer: string | null;
}

const securityQuestions = [
  {
    value: "-- Select Security Question",
    label: "-- Select Security Question",
  },
  {
    value: "What was your childhood nickname?",
    label: "What was your childhood nickname?",
  },
  {
    value: "In what city did you mother and father meet?",
    label: "In what city did your mother and father meet?",
  },
  {
    value: "What is your favourite movie?",
    label: "What is your favourite movie?",
  },
  {
    value: "What is your favourite color?",
    label: "What is your favourite color?",
  },
  {
    value: "What is your mother's maiden name?",
    label: "What is your mother's maiden name?",
  },
  {
    value: "What phone number do your remember most from your childhood?",
    label: "What phone number do your remember most from your childhood?",
  },
];

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [security_question, setSecurityQuestion] = useState("");
  const [security_answer, setSecurtyAnswer] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirm_password, setConfirmPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const url = "https://order-tracker-api-production.up.railway.app/reset/password";
    const data: ForgotPasswordDetails = {
      email: email,
      security_question: security_question,
      security_answer: security_answer,
      password: password,
      confirm_password: confirm_password,
    };
    try {
      const res: AxiosResponse = await axios.post(url, data);
      if (res.status === 200) {
        setLoading(false);
        navigate("/");
      } else {
        console.log("error sending data");
        setError("An error occurred, please try again");
      }
    } catch (err) {
      // console.log(err);
      setLoading(false);
      setError("An error occurred, please try again");
    }
  };
  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">Forgot Password</h2>
        <Box
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
        >
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />
          <br />
          <TextField
          id="outlined-security-question"
          select
          label="Security Question"
          value={security_question}
          onChange={(e) => setSecurityQuestion(e.target.value)}
          style={{ width: "25ch" }}
        >
          {securityQuestions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
          <br />
          <br />
          <TextField
            id="outlined-basic"
            label="Security Answer"
            variant="outlined"
            value={security_answer}
            onChange={(e) => setSecurtyAnswer(e.target.value.toLowerCase())}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />
          <br />
          <TextField
            id="outlined-password"
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value.toLowerCase())}
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
          <br />
          <br />
          <TextField
            id="outlined-password"
            label="Confirm Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value.toLowerCase())}
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
          <br />
          <br />

          <center>
          {loading ? (
              <CircularProgress style={{ color: "red" }} />
            
          ) : (
            <Button
              type="submit"
              variant="contained"
              className="login-button"
              style={{
                color: "#fff",
                backgroundColor: "red",
                marginTop: "23px",
              }}
            >
              Forgot Password
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          </center>
          </form>
        </Box>
      </div>
    </>
  );
};

export default ForgotPasswordComponent;
