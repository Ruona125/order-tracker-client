import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams, useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import Logo from "../../assets/order.jpg";

interface IncomeData {
  amount: number | null;
  description: string | null;
  name_of_income: string | null;
  date: string;
  order_id: any;
  full_name?: string | null
}

const CreateIncomeComponent: React.FC = () => {
  const { order_id } = useParams<{ order_id: string }>();
  const { token } = useSelector((state: any) => state.user.userDetails);
  const [certainIncome, setCertainIncome] = useState<IncomeData | null>(null);

  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [name_of_income, setNameOfIncome] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

  useEffect(() => {
    const url = `https://order-tracker-api-production.up.railway.app/order/${order_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<IncomeData>(url, { headers }).then((response) => {
      setCertainIncome(response.data);
      // console.log(response.data)
    });
  }, [order_id]);

  if (!certainIncome) return null;
  // console.log(certainIncome.full_name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://order-tracker-api-production.up.railway.app/income`;
    const data: IncomeData = {
      order_id: order_id,
      amount,
      name_of_income,
      description,
      date,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true)
    try {
      const res: AxiosResponse = await axios.post(url, data, { headers });
      if (res.status === 200) {
        setAmount(null);
        setNameOfIncome("");
        setDescription("");
        setDate(""); // Provide a valid initial value for date
        navigate("/income")
        setLoading(false)
      } else {
        setError("Error sending data");
      }
    } catch (err) {
      setLoading(false)
      setError("Error sending data");
    }
  };

  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">
          Create Income ({certainIncome.full_name})
        </h2>
        <form
          style={{ display: "grid", marginTop: "23px" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="amount"
            label="Amount"
            variant="outlined"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="name_of_income"
            label="Name of Income"
            variant="outlined"
            type="text"
            value={name_of_income}
            onChange={(e) => setNameOfIncome(e.target.value)}
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

          <TextField
            id="date"
            label="Date"
            variant="outlined"
            type="date"
            value={date} // Provide the date in the required format
            onChange={(e) => setDate(e.target.value)}
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
              style={{
                color: "#fff",
                backgroundColor: "red",
                marginTop: "23px",
              }}
            >
              Create Income
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default CreateIncomeComponent;
