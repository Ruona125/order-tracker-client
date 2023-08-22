import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";

import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface StaffData {
  old_password: string;
  new_password: string;
  confirm_password: string;
  user_id: string;
}

const ChangePasswordComponent = () => {
  const { token, user_id } = useSelector(
    (state: any) => state.user.userDetails
  );

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = "http://localhost:8000/update/password";
    // const url = "http://localhost:8000/update/password";
    const data: StaffData = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
      user_id: user_id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    try {
      setLoading(true); // Set loading to true to show the CircularProgress
      const res: AxiosResponse = await axios.post(url, data, { headers });
      if (res.status === 200) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);
      } else {
        console.log("error sending data");
        setError("An error occurred, please try again");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred, please try again");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">Change Password</h2>
        {/* Wrap the form with Box component and apply the styles using sx */}
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
            display: "grid",
            marginTop: "23px",
          }}
        >
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              id="outlined-basic"
              label="Old Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value.toLowerCase())}
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
              id="outlined-basic"
              label="New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value.toLowerCase())}
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
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
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
           

            {loading ? (
              <center>
                <CircularProgress style={{ color: "red" }} />
              </center>
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
                Change Password
              </Button>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </Box>
      </div>
    </>
  );
};

export default ChangePasswordComponent;
