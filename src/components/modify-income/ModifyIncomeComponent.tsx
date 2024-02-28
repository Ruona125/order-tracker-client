import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";
import axios, { AxiosResponse } from "axios";
import Logo from "../../assets/order.jpg";
import { TextField, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment"

interface IncomeData {
  amount: number;
  description: string;
  name_of_income: string;
  date: Date;
}

const ModifyIncomeComponent: React.FC = () => {
  const { income_id } = useParams();
  const { token } = useSelector((state: any) => state.user.userDetails);

  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [name_of_income, setNameOfIncome] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://order-tracker-api-production.up.railway.app/income/${income_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<IncomeData>(url, { headers }).then((response) => {
      const { amount, description, name_of_income, date } = response.data;
      setAmount(amount);
      setDescription(description);
      setNameOfIncome(name_of_income);
      setDate(moment(date).format("YYYY-MM-DD"));
    });
  }, [income_id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://order-tracker-api-production.up.railway.app/income/${income_id}`;
    const data: IncomeData = {
      amount,
      name_of_income,
      description,
      date: new Date(date),
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true)

    try {
      const res: AxiosResponse = await axios.put(url, data, { headers });
      if (res.status === 200) {
        navigate("/income");
      } else {
        setError("error sending data");
      }
    } catch (err) {
      setError("error sending data");
    }
  };

  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">Modify Income</h2>
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
            value={date}
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
              Modify Income
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default ModifyIncomeComponent;
