import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";

interface CustomerData {
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
  location: string | null;
}

const CreateCustomerComponent: React.FC = () => {
  const { token } = useSelector((state: any) => state.user.userDetails);

  const [fullName, setFullName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = "https://order-tracker-api-production.up.railway.app/customer";
    const data: CustomerData = {
      full_name: fullName,
      phone_number: phoneNumber,
      email: email,
      location: location,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true);

    try {
      const res: AxiosResponse = await axios.post(url, data, { headers });
      if (res.status === 200) {
        setFullName("");
        setPhoneNumber("");
        setEmail("");
        setLocation("");
        navigate("/customer")
        setLoading(false);
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
        <h2 className="login-heading">Create Customer</h2>
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
          // style={{ display: "grid", marginTop: "23px" }}
          // noValidate
          // autoComplete="off"
          // onSubmit={handleSubmit}
        >
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              id="outlined-basic"
              label="full Name"
              variant="outlined"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputLabelProps={{ style: { color: "red" } }}
            />
            <br />
            <br />

            <TextField
              id="outlined-basic"
              label="phone number"
              variant="outlined"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              InputLabelProps={{ style: { color: "red" } }}
            />
            <br />
            <br />

            <TextField
              id="outlined-basic"
              label="email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "red" } }}
            />
            <br />
            <br />

            <TextField
              id="outlined-basic"
              label="Location"
              variant="outlined"
              type="email"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputLabelProps={{ style: { color: "red" } }}
            />
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
                  Create Customer
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

export default CreateCustomerComponent;
