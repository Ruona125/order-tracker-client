import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams, useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface MilestoneData {
  description: string | null;
  countdown_timer: string;
  order_id: any;
  full_name?: string | null
}

const CreateMilestoneComponent = () => {
  const { order_id } = useParams<{ order_id: string }>();
  const { token } = useSelector((state: any) => state.user.userDetails);
  const [certainMilestone, setCertainMilestone] =
    useState<MilestoneData | null>(null);

  const [description, setDescription] = useState<string | null>(null);
  const [countdown_timer, setCountdownTimer] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
const navigate = useNavigate()
  useEffect(() => {
    const url = `https://order-tracker-api-production.up.railway.app/order/${order_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<MilestoneData>(url, { headers }).then((response) => {
      setCertainMilestone(response.data);
    });
  }, [order_id]);

  if (!certainMilestone) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://order-tracker-api-production.up.railway.app/milestone`;
    const data: MilestoneData = {
      order_id: order_id,
      description,
      countdown_timer,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true)
    try {
      const res: AxiosResponse = await axios.post(url, data, { headers });
      if (res.status === 200) {
        setDescription("");
        navigate("/milestone")
        setLoading(false)
      } else {
        setError("Error sending data");
      }
    } catch (err) {
      setLoading(false)
      setError("Error sending Data");
    }
  };

  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">
          Create Milestone ({certainMilestone.full_name})
        </h2>
        <form
          style={{ display: "grid", marginTop: "23px" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >

          <TextField
            id="description"
            label="Description"
            variant="outlined"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={countdown_timer} // Set the value prop of RadioGroup to the countdownTimer state
            onChange={(e) => setCountdownTimer(e.target.value)} // Update the countdownTimer state on change
          >
            <FormControlLabel value="a" control={<Radio />} label="7 days" />
            <FormControlLabel value="b" control={<Radio />} label="3 days" />
            <FormControlLabel value="c" control={<Radio />} label="1 day" />
            <FormControlLabel value="d" control={<Radio />} label="12 hours" />
            <FormControlLabel value="e" control={<Radio />} label="3 hours" />
            <FormControlLabel value="f" control={<Radio />} label="1 month" />
            <FormControlLabel value="g" control={<Radio />} label="2 months" />
          </RadioGroup>

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
              Create Milestone
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default CreateMilestoneComponent;
