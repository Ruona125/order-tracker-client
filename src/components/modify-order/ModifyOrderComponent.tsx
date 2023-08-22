import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";
import axios, { AxiosResponse } from "axios";
import Logo from "../../assets/order.jpg";
import { TextField, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment"

interface OrderData {
  details: string;
  cost_of_order: number;
  start_date: Date;
  end_date: Date;
  status: string;
  order_number: number
}

const ModifyOrderComponent = () => {
  const { order_id } = useParams();
  const { token } = useSelector((state: any) => state.user.userDetails);

  const [details, setDetails] = useState<string>("");
  const [cost_of_order, setCostOfOrder] = useState<number>(0);
  const [order_number, setOrderNumber] = useState<number>(0)
  const [start_date, setStartDate] = useState<string>("");
  const [end_date, setEndDate] = useState<string>("");
  
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `http://localhost:8000/order/${order_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<OrderData>(url, { headers }).then((response) => {
      const { details, cost_of_order, start_date, end_date, status, order_number } =
        response.data;
        // console.log(response.data)
      setDetails(details);
      setCostOfOrder(cost_of_order);
      setOrderNumber(order_number)
      setStartDate(moment(start_date).format("YYYY-MM-DD"));
      setEndDate(moment(end_date).format("YYYY-MM-DD"))
      setStatus(status);
    });
  }, [order_id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:8000/order/${order_id}`;
    const data: OrderData = {
      details,
      cost_of_order,
      order_number,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
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
        navigate("/order");
        setLoading(false)
      } else {
        setError("error sending data");
      }
    } catch (err) {
      setError("error sending data")
    }
  };
  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">Modify order</h2>
        <form
          style={{ display: "grid", marginTop: "23px" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="details"
            label="Details"
            variant="outlined"
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="cost_of_order"
            label="Cost Of Order"
            variant="outlined"
            type="number"
            value={cost_of_order}
            onChange={(e) => setCostOfOrder(Number(e.target.value))}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />
          <TextField
            id="order_number"
            label="Order Number"
            variant="outlined"
            type="number"
            value={order_number}
            onChange={(e) => setOrderNumber(Number(e.target.value))}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="start_date"
            label="Start Date"
            variant="outlined"
            type="date"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="end_date"
            label="End Date"
            variant="outlined"
            type="date"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="status"
            label="Status"
            variant="outlined"
            type="text" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
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
              style={{ color: "#fff", backgroundColor: "red", marginTop: "23px" }}
            >
              Modify Order
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}

        </form>
      </div>
    </>
  );
};

export default ModifyOrderComponent;