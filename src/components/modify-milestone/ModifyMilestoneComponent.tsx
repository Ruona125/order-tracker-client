import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";
import axios, { AxiosResponse } from "axios";
import Logo from "../../assets/order.jpg";
import { TextField, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
interface MilestoneData {
  milestone_status: string;
  description: string;
  countdown_timer: string;
}

const ModifyMilestoneComponent = () => {
  const { milestone_id } = useParams();
  const { token } = useSelector((state: any) => state.user.userDetails);

  const [milestone_status, setMileStoneStatus] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [countdown_timer, setCountdownTimer] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const url = `http://localhost:8000/milestone/${milestone_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<MilestoneData>(url, { headers }).then((response) => {
      const { milestone_status, description, countdown_timer } = response.data;
      setMileStoneStatus(milestone_status);
      setDescription(description);
      setCountdownTimer(countdown_timer);
    });
  }, [milestone_id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:8000/milestone/${milestone_id}`;
    const data: MilestoneData = {
      milestone_status,
      description,
      countdown_timer,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true);
    try {
      const res: AxiosResponse = await axios.put(url, data, { headers });
      if (res.status === 200) {
        navigate("/milestone");
      } else {
        setError("error sending data");
      }
    } catch (err) {
      setLoading(false)
      setError("error sending data");
    }
  };
  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">Modify Milestone</h2>
        <form
          style={{ display: "grid", marginTop: "23px" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="milestone_status"
            label="Milestone Status"
            variant="outlined"
            type="text"
            value={milestone_status}
            onChange={(e) => setMileStoneStatus(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

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
              Modify Milestone
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default ModifyMilestoneComponent;
