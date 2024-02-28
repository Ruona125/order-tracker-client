import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams, useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface TaskData {
  deadline: string;
  task: string | null;
  user_id: any;
  name?: string | null;
}


const CreateTaskComponent = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const { token } = useSelector((state: any) => state.user.userDetails);
  const [certainTask, setCertainTask] = useState<TaskData | null>(null);

  const [deadline, setDeadline] = useState<string>("");
  const [task, setTask] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://order-tracker-api-production.up.railway.app/user/register/${user_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<TaskData>(url, { headers }).then((response) => {
      setCertainTask(response.data);
    });
  }, [user_id]);
  if (!certainTask) return null;

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://order-tracker-api-production.up.railway.app/task`;
    const data: TaskData = {
      user_id: user_id,
      deadline,
      task,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true)
    try {
      const res: AxiosResponse = await axios.post(url, data, { headers });
      if (res.status === 200) {
        setTask("");
        setLoading(false)
        navigate("/tasks")
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
          Create Task ({certainTask.name})
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
            multiline
            rows={4}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <RadioGroup
          row
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={deadline} // Set the value prop of RadioGroup to the countdownTimer state
            onChange={(e) => setDeadline(e.target.value)} // Update the countdownTimer state on change
          >
            <FormControlLabel value="a" control={<Radio />} label="7 days" />
            <FormControlLabel value="b" control={<Radio />} label="3 days" />
            <FormControlLabel value="c" control={<Radio />} label="1 day" />
            <FormControlLabel value="d" control={<Radio />} label="1 hour" />
            <FormControlLabel value="e" control={<Radio />} label="3 hours" />
            <FormControlLabel value="f" control={<Radio />} label="5 hours" />
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
              Create Task
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default CreateTaskComponent;
