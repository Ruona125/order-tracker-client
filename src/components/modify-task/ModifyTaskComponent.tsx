import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";
import axios, { AxiosResponse } from "axios";
import Logo from "../../assets/order.jpg";
import { TextField, Button, MenuItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
interface TaskData {
  deadline: string;
  task: string;
  status: string;
}

const ModifyTaskComponent = () => {
  const { task_id } = useParams();
  const { token } = useSelector((state: any) => state.user.userDetails);

  const [deadline, setDeadline] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `http://localhost:8000/task/${task_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<TaskData>(url, { headers }).then((response) => {
      const { deadline, task, status } = response.data;
      setDeadline(deadline);
      setTask(task);
      setStatus(status);
    });
  }, [task_id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:8000/task/${task_id}`;
    const data: TaskData = {
      deadline,
      task,
      status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true)
    try {
      const res: AxiosResponse = await axios.put(url, data, { headers });
      if (res.status === 200) {
        navigate("/tasks");
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
        <h2 className="login-heading">Modify Task</h2>
        <form
          style={{ display: "grid", marginTop: "23px" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="task"
            label="task"
            variant="outlined"
            type="text"
            value={task}
            multiline
            rows={4}
            onChange={(e) => setTask(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          {/* <TextField
            id="status"
            label="status"
            variant="outlined"
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          /> */}
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            autoWidth
            label="Status"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
          </Select>

          <br />

          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            defaultValue={deadline} // Set the value prop of RadioGroup to the countdownTimer state
            onChange={(e) => setDeadline(e.target.value)} // Update the countdownTimer state on change
          >
            <FormControlLabel value="a" control={<Radio />} label="7 days" />
            <FormControlLabel value="b" control={<Radio />} label="3 days" />
            <FormControlLabel value="c" control={<Radio />} label="1 day" />
            <FormControlLabel value="d" control={<Radio />} label="1 hour" />
            <FormControlLabel value="e" control={<Radio />} label="3 hours" />
            <FormControlLabel value="f" control={<Radio />} label="5 hours" />
            {/* {Object.entries(deadlineOptions).map(([key, value]) => (
    <FormControlLabel
      key={key}
      value={value}
      control={<Radio />}
      label={value}
      checked={deadlineOptions[key] === deadline}
    />
  ))} */}
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
              Modify Task
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default ModifyTaskComponent;
