import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../../assets/order.jpg";
import { Button, MenuItem, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

const CreateStaffComponent: React.FC = () => {
  const { token } = useSelector((state: any) => state.user.userDetails);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [security_question, setSecurityQuestion] = useState("");
  const [security_answer, setSecurityAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const register = async (
    name: string,
    email: string,
    password: string,
    security_question: string,
    security_answer: string
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/user/register",
        {
          name,
          email,
          password,
          security_question,
          security_answer,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        navigate("/staffs");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred, please try again");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password, security_question, security_answer);
  };

  return (
    <div className="container">
      <center>
        <img src={Logo} className="img-logo" alt="Logo" />
      </center>
      <h2 className="login-heading">Create Staff Account</h2>

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
        onSubmit={handleSubmit}
      >
        <TextField
          id="outlined-name"
          label="Name"
          variant="outlined"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputLabelProps={{ style: { color: "red" } }}
        />
        <br />
        <TextField
          id="outlined-email"
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          InputLabelProps={{ style: { color: "red" } }}
        />
        <br />
        <TextField
          id="outlined-security-question"
          select
          label="Security Question"
          value={security_question}
          onChange={(e) => setSecurityQuestion(e.target.value)}
        >
          {securityQuestions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          type="text"
          label="Security Answer"
          value={security_answer}
          onChange={(e) => setSecurityAnswer(e.target.value.toLowerCase())}
          fullWidth
        />
        <br />
        <TextField
          id="outlined-password"
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

        {loading ? (
          <center>
            <CircularProgress style={{ color: "red" }} />
          </center>
        ) : (
          <Button
            type="submit"
            variant="contained"
            className="login-button"
            style={{ color: "#fff", backgroundColor: "red", marginTop: "23px" }}
          >
            Create Staff
          </Button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Box>
    </div>
  );
};

export default CreateStaffComponent;
