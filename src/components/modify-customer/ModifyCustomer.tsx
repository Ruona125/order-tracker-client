import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";

interface CustomerData {
  full_name: string;
  phone_number: string;
  email: string;
  location: string;
}

const ModifyCustomerComponent: React.FC = () => {
  const { customer_id } = useParams();
  const { token } = useSelector((state: any) => state.user.userDetails);

  const [full_name, setFullName] = useState<string>("");
  const [phone_number, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `http://localhost:8000/customer/${customer_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get(url, { headers }).then((response) => {
      setFullName(response.data.full_name);
      setPhoneNumber(response.data.phone_number);
      setEmail(response.data.email);
      setLocation(response.data.location);
    });
  }, [customer_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:8000/customer/${customer_id}`;
    const data: CustomerData = {
      full_name: full_name,
      phone_number: phone_number,
      email: email,
      location: location,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    try {
      const res: AxiosResponse = await axios.put(url, data, { headers });
      if (res.status === 200) {
        navigate("/customer");
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
        <h2 className="login-heading">Modify Customer</h2>
        <br />
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
              label="full Name"
              variant="outlined"
              type="text"
              value={full_name}
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
              value={phone_number}
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
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
                Modify Customer
              </Button>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </Box>
      </div>
    </>
  );
};

export default ModifyCustomerComponent;
