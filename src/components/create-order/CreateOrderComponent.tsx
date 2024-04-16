import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";

interface OrderData {
  details: string | null;
  cost_of_order: number | null;
  start_date: string;
  end_date: string;
  status: string | null;
  customer_id: string;
  full_name:string | null;
  order_number: number | null
 

}

const CreateOrderComponent: React.FC = () => {
  const { customer_id } = useParams<{ customer_id: string }>();
  const { token } = useSelector((state: any) => state.user.userDetails);
  const [certainOrder, setCertainOrder] = useState<OrderData | null>(null);

  const [details, setDetails] = useState<string | null>("");
  const [cost_of_order, setCostOfOrder] = useState<number | null>(null);
  const [order_number, setOrderNumber] = useState<number | null>(null)
  const [start_date, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [end_date, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<string | null>("");
  const [order_design_artwork, setOrderDesignArtwork] = useState<File | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()


  useEffect(() => {
    const url = `https://order-tracker-api-production.up.railway.app/customer/${customer_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<OrderData>(url, { headers }).then((response) => {
      setCertainOrder(response.data);
    });
  }, [customer_id]);

  if (!certainOrder) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("customer_id", String(customer_id));
    formData.append("details", String(details));
    formData.append("cost_of_order", String(cost_of_order));
    formData.append("start_date", start_date);
    formData.append("end_date", end_date);
    formData.append("status", String(status));
    formData.append("order_number", String(order_number))
    if (order_design_artwork !== null) {
      formData.append("order_design_artwork", order_design_artwork);
    }

    const url = "https://order-tracker-api-production.up.railway.app/order";
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    setLoading(true)

    try {
      const res = await axios.post(url, formData, { headers });
      if (res.status === 200) {
        setDetails("")
        setCostOfOrder(0);
        setStartDate("");
        setEndDate("");
        setStatus("")
        setOrderNumber(0);
        setLoading(false)
        navigate("/order")
      } else {
        setError("Error sending data");
      }
    } catch (err) {
      setLoading(false)
      setError("Error sending data");
    }
  };

  const fileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOrderDesignArtwork(file);
    }
  };

  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">Create order({certainOrder.full_name})</h2>
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

         
         
          {/* <br /> */}

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
              Create Order
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <br />
        </form>
      </div>
    </>
  );
};

export default CreateOrderComponent;