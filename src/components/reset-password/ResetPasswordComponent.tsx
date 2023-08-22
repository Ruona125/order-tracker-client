import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";

interface ForgotPasswordDetails {
  password: string;
  confirm_password: string;
}

const ResetPasswordComponent = () => {
    const { reset_token } = useSelector((state: any) => state.user.userDetails);  const [password, setPassword] = useState<string>("");
  const [confirm_password, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [certainUser, setCertainUser] = useState<ForgotPasswordDetails | null>(null)
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const url = `http://localhost:8000/user/register/${reset_token}`;
//     // const headers = {
//     //   "Content-Type": "application/json",
//     //   Authorization: token,
//     // };
//     axios.get<ForgotPasswordDetails>(url).then((response) => {
//         setCertainUser(response.data);
//     });
//   }, [reset_token]);
//   if (!certainUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:8000/reset/password/${reset_token}`;
    const data: ForgotPasswordDetails = {
      password: password,
      confirm_password: confirm_password
    };
    try {
      const res: AxiosResponse = await axios.post(url, data);
      if (res.status === 200) {
        setPassword("");
        setConfirmPassword("")
      } else {
        console.log("error sending data");
        setError("An error occurred, please try again");
      }
    } catch (err) {
      console.log(err);
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
        <h2 className="login-heading">Reset Password</h2>
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
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.toLowerCase())}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value.toLowerCase())}
            InputLabelProps={{ style: { color: "red" } }}
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
              style={{
                color: "#fff",
                backgroundColor: "red",
                marginTop: "23px",
              }}
            >
              Reset Password
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </Box>
      </div>
    </>
  );
};

export default ResetPasswordComponent;
